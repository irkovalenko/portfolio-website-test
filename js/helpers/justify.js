const LIB_URL =
  "https://esm.sh/tex-linebreak@0.9.0?cjs-exports=createHyphenator,layoutItemsFromString,breakLines";
const GLUE_URL = "https://esm.sh/@typehug/all";

const patternLoaders = {
  en: () => import("https://esm.sh/hyphenation.en-us"),
  pl: () => import("https://esm.sh/hyphenation.pl"),
};

// Set to true to log the chosen layout of every paragraph.
const DEBUG = false;

// Below this many characters per line, ragged-right beats justified.
const MIN_MEASURE = 45;

// "Reduce spacing" lever: break the paragraph as if the column were this much
// wider, then squeeze each line to the real width with negative word-spacing.
// Fractions of the real width; 0 = normal layout.
const WIDTH_NUDGES = [0, 0.005, 0.01, 0.015];

// Scoring (units: squared gap deviation, where 1 = gap off by one normal space).
const HYPHEN_COST = 0.3; // one hyphen costs as much as a line off by ~0.55 spaces
const TIGHT_WEIGHT = 2; // squeezed gaps look worse than loose ones of equal size
const OVERFLOW_PENALTY = 25; // a line that does not fit the column

// If even the best layout has a gap this far from normal, give up on
// justification for that paragraph and let CSS render it ragged.
const RAGGED_IF_LOOSER_THAN = 1.2; // gap > 2.2x a normal space
const RAGGED_IF_TIGHTER_THAN = 0.4; // gap < 0.6x a normal space

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

// Approximate characters per line for the current ctx.font.
function charsPerLine(text, width) {
  const avg = ctx.measureText(text).width / Math.max(text.length, 1);
  return width / avg;
}

function toLines(items, breaks) {
  const lines = [];
  let start = 0;
  breaks.forEach((bp, i) => {
    const last = i === breaks.length - 1;
    let text = items
      .slice(start, bp)
      .map((it) => it.text ?? "")
      .join("");
    let hyphenated = false;
    if (
      !last &&
      items[bp]?.flagged &&
      !/[-\u2010\u2011\u2013\u2014]$/.test(text)
    ) {
      text += "-";
      hyphenated = true;
    }
    text = fromSentinel(text).replace(/ +$/, "");
    lines.push({ text, last, hyphenated });
    start = bp + 1;
  });
  return lines;
}

// Gap per line relative to a normal space (-0.1 = 10% tighter, 1 = twice as wide)
// plus a penalty that grows with how far gaps are from normal.
function spacingStats(lines, width, spaceW) {
  let min = 0;
  let max = 0;
  let penalty = 0;
  for (const l of lines) {
    const natural = ctx.measureText(l.text).width;
    const gaps = (l.text.match(/[ \u00A0]/g) || []).length; // word-spacing skips U+202F

    if (l.last || !gaps) {
      if (natural > width + 0.5) penalty += OVERFLOW_PENALTY;
      continue;
    }

    const s = (width - natural) / gaps / spaceW;
    min = Math.min(min, s);
    max = Math.max(max, s);
    penalty += s < 0 ? TIGHT_WEIGHT * s * s : s * s;
  }
  return { min, max, penalty };
}

function layoutParagraph(p, api, hyphenate, glueText) {
  const raw = (p.dataset.texText ??= p.textContent);
  const original = glueText(raw);

  const cs = getComputedStyle(p);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

  const width = p.getBoundingClientRect().width;

  const ragged = () => {
    p.textContent = raw;
    p.classList.add("tex-ragged");
  };

  // Too narrow for good justification: hand over to CSS (see .tex-ragged).
  if (charsPerLine(raw, width) < MIN_MEASURE) {
    ragged();
    return;
  }

  const measure = (w) => ctx.measureText(fromSentinel(w)).width;
  const spaceW = ctx.measureText(" ").width;
  const text = toSentinel(original.replace(/[ \t\r\n]+/g, " ").trim());

  const solve = (hyph, nudge) => {
    try {
      const items = api.layoutItemsFromString(text, measure, hyph);
      let breaks = api.breakLines(items, width * (1 + nudge));
      if (breaks[0] === 0) breaks = breaks.slice(1);
      const lines = toLines(items, breaks);
      const stats = spacingStats(lines, width, spaceW);
      const hyphens = lines.filter((l) => l.hyphenated).length;
      return {
        lines,
        hyphens,
        nudge,
        withHyph: Boolean(hyph),
        ...stats,
        score: stats.penalty + hyphens * HYPHEN_COST,
      };
    } catch {
      return null; // breaker found no solution for this candidate
    }
  };

  // Try every combination of (hyphenation on/off) x (width nudge) and keep the
  // layout with the best score. Ties keep the earlier, more conservative one.
  const candidates = [];
  for (const nudge of WIDTH_NUDGES) {
    candidates.push(solve(hyphenate, nudge));
    if (hyphenate) candidates.push(solve(undefined, nudge));
  }
  const valid = candidates.filter(Boolean);
  if (!valid.length) throw new Error("No layout found");
  const best = valid.reduce((a, b) => (b.score < a.score ? b : a));

  if (DEBUG) {
    console.log(
      p.className,
      "chars/line:", Math.round(charsPerLine(raw, width)),
      "| hyphens:", best.hyphens,
      "| spacing min/max:", best.min.toFixed(2), best.max.toFixed(2),
      "| nudge:", best.nudge,
      "| hyphenation:", best.withHyph,
      "| score:", best.score.toFixed(2),
    );
  }

  // Even the best justified layout is ugly: let CSS handle it.
  if (
    best.max > RAGGED_IF_LOOSER_THAN ||
    best.min < -RAGGED_IF_TIGHTER_THAN
  ) {
    ragged();
    return;
  }

  p.classList.remove("tex-ragged");

  const frag = document.createDocumentFragment();
  best.lines.forEach(({ text: line, last }) => {
    const span = document.createElement("span");
    span.className = "tex-line";
    span.textContent = line;

    if (!last) {
      const natural = ctx.measureText(line).width;
      const gaps = (line.match(/[ \u00A0]/g) || []).length;
      if (gaps) span.style.wordSpacing = `${(width - natural) / gaps}px`;
    }
    frag.append(span);
  });

  p.replaceChildren(frag);
}

export async function justify(root, lang, selector = "p") {
  if (!root) return;

  const locale = lang === "pl" ? "pl" : "en";

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
    const mod = await patternLoaders[locale]();
    hyphenate = protectGlued(
      limitHyphenation(api.createHyphenator(mod.default ?? mod), 6, 3, 3),
    );
  } catch (err) {
    console.warn(
      `No hyphenation patterns for "${locale}", justifying without`,
      err,
    );
  }

  // Language-specific non-breaking spaces (single source of truth for gluing).
  let glueText = (s) => s; // fallback: no gluing
  try {
    const mod = await import(GLUE_URL);
    const glue = unwrap(mod, "glue");
    if (typeof glue === "function") {
      glueText = (s) => glue(s, { locale });
    } else {
      console.warn("glue export missing, justifying without it");
    }
  } catch (err) {
    console.warn("glue failed to load, justifying without it", err);
  }

  await document.fonts.ready;

  const run = () => {
    root.querySelectorAll(selector).forEach((p) => {
      try {
        layoutParagraph(p, api, hyphenate, glueText);
      } catch (err) {
        console.warn("Line breaking failed for a paragraph", err);
        if (p.dataset.texText) p.textContent = p.dataset.texText;
        p.classList.add("tex-ragged");
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