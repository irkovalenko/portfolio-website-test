import { siteRoot } from "./paths.js";

const SUPPORTED = ["en", "pl"];
const FLAGS = {
  en: new URL("resources/en.svg", siteRoot).href,
  pl: new URL("resources/pl.svg", siteRoot).href,
};

function detectLang() {
  let saved = null;
  try {
    saved = localStorage.getItem("lang");
  } catch {}
  if (SUPPORTED.includes(saved)) return saved;
  return navigator.language?.toLowerCase().startsWith("pl") ? "pl" : "en";
}

const lang = detectLang();
let dict = {};
let dictPromise;

export const getLang = () => lang;

export function loadDict() {
  return (dictPromise ??= (async () => {
    try {
      const res = await fetch(new URL(`locales/${lang}.json`, siteRoot));
      if (!res.ok) throw new Error(`Missing locales/${lang}.json`);
      dict = await res.json();
    } catch (err) {
      console.warn("i18n:", err);
    }
    return dict;
  })());
}

export const t = (key, fallback = key) => dict[key] ?? fallback;

export function localizeProject(project) {
  const tr = dict.projects?.[project.slug];
  return tr ? { ...project, ...tr } : project;
}

export function applyTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = dict[el.dataset.i18n];
    if (text) el.innerHTML = text;
  });
  root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const text = dict[el.dataset.i18nAriaLabel];
    if (text) el.setAttribute("aria-label", text);
  });
}

export async function initI18n() {
  const next = lang === "pl" ? "en" : "pl";
  document.documentElement.lang = lang;

  const button = document.getElementById("lang-toggle");
  if (button) {
    const icon = button.querySelector("img");
    if (icon) {
      icon.src = FLAGS[next];
      icon.alt = "";
    }
    button.setAttribute("aria-label", next === "pl" ? "Polski" : "English");
    button.addEventListener("click", () => {
      try {
        localStorage.setItem("lang", next);
      } catch {}
      location.reload();
    });
  }

  await loadDict();
  applyTranslations();
}
