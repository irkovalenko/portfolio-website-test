import { siteRoot } from "./paths.js";

const ICONS = {
  light: new URL("resources/moon.png", siteRoot).href,
  dark: new URL("resources/sun.png", siteRoot).href,
};

const FAVICONS = {
  light: new URL("resources/favicons/light.svg", siteRoot).href,
  dark: new URL("resources/favicons/dark.svg", siteRoot).href,
};

export function initTheme() {
  const root = document.documentElement;
  const button = document.querySelector(".theme-toggle");
  if (!button) return;
  const icon = button.querySelector("img");
  const favicon = document.querySelector("#favicon");

  function applyTheme(isDark) {
    root.classList.toggle("dark-mode", isDark);
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Light mode" : "Dark mode");
    icon.src = isDark ? ICONS.dark : ICONS.light;
    icon.alt = "";

    if (favicon) {
      favicon.href = isDark ? FAVICONS.dark : FAVICONS.light;
    }
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {}
  }

  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch {}
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved ? saved === "dark" : prefersDark);

  button.addEventListener("click", () => {
    applyTheme(!root.classList.contains("dark-mode"));
  });
}
