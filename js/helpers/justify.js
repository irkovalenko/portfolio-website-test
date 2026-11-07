const LIB_URL =
  "https://esm.sh/tex-linebreak@0.9.0?cjs-exports=createHyphenator,layoutItemsFromString,breakLines";

const patternLoaders = {
  en: () => import("https://esm.sh/hyphenation.en-us"),
  pl: () => import("https://esm.sh/hyphenation.pl"),
};

const NBSP = "\u00A0";
const NNBSP = "\u202F";
const S_NBSP = "\uE000";
const S_NNBSP = "\uE001";
const toSentinel = (s) => s.replaceAll(NBSP, S_NBSP).replaceAll(NNBSP, S_NNBSP);
const fromSentinel = (s) =>
  s.replaceAll(S_NBSP, NBSP).replaceAll(S_NNBSP, NNBSP);

const unwrap = (mod, key) => mod[key] ?? mod.default?.[key];
const ctx = document.createElement("canvas").getContext("2d");

function limitHyphenation(hyphenate, minWord = 6, minLeft = 3, minRight = 3) {
  return (word) => {
    if (word.length < minWord) return [word];

    const parts = hyphenate(word);
    if (
      !Array.isArray(parts) ||
      parts.length < 2 ||
      typeof parts[0] !== "string"
    ) {
      return parts;
    }

    const out = [];
    let acc = "";
    parts.forEach((part, i) => {
      acc += part;
      const rest = parts.slice(i + 1).join("").length;
      if (
        i === parts.length - 1 ||
        (acc.length >= minLeft && rest >= minRight)
      ) {
        out.push(acc);
        acc = "";
      }
    });
    return out;
  };
}

function protectGlued(hyphenate) {
  return (word) => {
    const m = word.match(/^([\s\S]*[\uE000\uE001])([^\uE000\uE001]+)$/);
    if (!m) return hyphenate(word);

    const [, head, tail] = m;
    const parts = hyphenate(tail);
    if (!Array.isArray(parts) || typeof parts[0] !== "string") return [word];
    return [head + parts[0], ...parts.slice(1)];
  };
}

function layoutParagraph(p, api, hyphenate) {
  const original = (p.dataset.texText ??= p.textContent);
  const cs = getComputedStyle(p);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

  const measure = (w) => ctx.measureText(fromSentinel(w)).width;
  const width = p.getBoundingClientRect().width;

  const text = toSentinel(original.replace(/[ \t\r\n]+/g, " ").trim());
  const items = api.layoutItemsFromString(text, measure, hyphenate);

  let breaks = api.breakLines(items, width);
  if (breaks[0] === 0) breaks = breaks.slice(1);

  const frag = document.createDocumentFragment();
  let start = 0;

  breaks.forEach((bp, i) => {
    const isLast = i === breaks.length - 1;
    let line = items
      .slice(start, bp)
      .map((it) => it.text ?? "")
      .join("");
    if (
      !isLast &&
      items[bp].type === "penalty" &&
      items[bp].flagged &&
      !/[-\u2010\u2011\u2013\u2014]$/.test(line)
    ) {
      line += "-";
    }
    line = fromSentinel(line).replace(/ +$/, "");
    start = bp + 1;

    const span = document.createElement("span");
    span.className = "tex-line";
    span.textContent = line;

    if (!isLast) {
      // Spread the leftover width over the spaces of this line
      const natural = ctx.measureText(line).width;
      const gaps = (line.match(/[ \u00A0]/g) || []).length;
      if (gaps) span.style.wordSpacing = `${(width - natural) / gaps}px`;
    }
    frag.append(span);
  });

  p.replaceChildren(frag);
}

export async function justifyDescription(root, lang) {
  let api;
  try {
    const lib = await import(LIB_URL);
    api = {
      createHyphenator: unwrap(lib, "createHyphenator"),
      layoutItemsFromString: unwrap(lib, "layoutItemsFromString"),
      breakLines: unwrap(lib, "breakLines"),
    };
    if (Object.values(api).some((f) => typeof f !== "function")) {
      console.warn(
        "tex-linebreak exports missing:",
        Object.keys(lib),
        lib.default && Object.keys(lib.default),
      );
      return;
    }
  } catch (err) {
    console.warn("tex-linebreak failed to load, keeping CSS layout", err);
    return;
  }

  let hyphenate; // undefined = no hyphenation
  try {
    const mod = await (patternLoaders[lang] ?? patternLoaders.en)();
    hyphenate = protectGlued(
      limitHyphenation(api.createHyphenator(mod.default ?? mod), 6, 3, 3),
    );
  } catch (err) {
    console.warn(
      `No hyphenation patterns for "${lang}", justifying without`,
      err,
    );
  }

  await document.fonts.ready;

  const run = () => {
    root.querySelectorAll("p").forEach((p) => {
      try {
        layoutParagraph(p, api, hyphenate);
      } catch (err) {
        console.warn("Line breaking failed for a paragraph", err);
        if (p.dataset.texText) p.textContent = p.dataset.texText;
      }
    });
  };

  run();

  let lastWidth = root.clientWidth;
  let timer;
  const observer = new ResizeObserver(() => {
    if (root.clientWidth === lastWidth) return;
    lastWidth = root.clientWidth;
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  });
  observer.observe(root);

  return () => observer.disconnect();
}
