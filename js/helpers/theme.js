import { siteRoot } from "./paths.js";

const ICONS = {
  light: new URL("resources/moon.png", siteRoot).href,
  dark: new URL("resources/sun.png", siteRoot).href,
};

export function initTheme() {
  const root = document.documentElement;
  const button = document.querySelector(".theme-toggle");
  if (!button) return;
  const icon = button.querySelector("img");

  function applyTheme(isDark) {
    root.classList.toggle("dark-mode", isDark);
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Light mode" : "Dark mode");
    icon.src = isDark ? ICONS.dark : ICONS.light;
    icon.alt = "";
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
