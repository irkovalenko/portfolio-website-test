import { loadComponent } from "./loadComponent.js";

const headerUrl = new URL("../../components/header.html", import.meta.url);
const siteRoot = new URL("../../", import.meta.url);

await loadComponent("header", headerUrl);

const links = document.querySelectorAll("#header nav a[href]");

links.forEach((a) => {
  a.href = new URL(a.getAttribute("href"), siteRoot).href;
});

function setActive(section) {
  links.forEach((a) => {
    const isActive = a.dataset.section === section;
    a.classList.toggle("active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

const normalize = (path) => path.replace(/index\.html$/, "");
const onHomePage =
  normalize(location.pathname) === normalize(siteRoot.pathname);

if (document.body.dataset.section) {
  // detail pages (e.g. a single project) declare their section explicitly
  setActive(document.body.dataset.section);
} else if (onHomePage) {
  // home page: highlight whichever section is currently in view
  const sections = [
    { key: "home", selector: "#hero" },
    { key: "about", selector: "#about" },
    { key: "projects", selector: "#work" },
  ];

  const update = () => {
    const line = window.innerHeight * 0.35;
    let current = "home";

    for (const { key, selector } of sections) {
      const el = document.querySelector(selector);
      if (el && el.getBoundingClientRect().top <= line) current = key;
    }

    const atBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    if (atBottom) current = sections[sections.length - 1].key;

    setActive(current);
  };

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);

  new ResizeObserver(update).observe(document.body);
  update();
}

const navContainer = document.querySelector("#header .nav-container");
const headerH = () => navContainer?.offsetHeight ?? 0;

if (navContainer) {
  new ResizeObserver(() => {
    document.documentElement.style.setProperty("--header-h", headerH() + "px");
  }).observe(navContainer);
}

function scrollToId(id, behavior = "instant") {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH();
  window.scrollTo({ top, behavior });
  return true;
}

if (onHomePage) {
  if (location.hash) {
    history.scrollRestoration = "manual";
    const id = decodeURIComponent(location.hash.slice(1));
    const align = () => scrollToId(id);

    align();
    addEventListener("load", align);

    const ro = new ResizeObserver(align);
    ro.observe(document.body);
    const stop = () => ro.disconnect();
    setTimeout(stop, 3000);
    ["wheel", "touchstart", "keydown"].forEach((evt) =>
      addEventListener(evt, stop, { once: true, passive: true }),
    );
  }

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = new URL(a.href);
      if (normalize(url.pathname) !== normalize(location.pathname)) return;
      e.preventDefault();
      if (url.hash) {
        scrollToId(decodeURIComponent(url.hash.slice(1)), "smooth");
        history.pushState(null, "", url.hash);
      } else {
        scrollTo({ top: 0, behavior: "smooth" });
        history.pushState(null, "", location.pathname);
      }
    });
  });
}

const root = document.documentElement;
const darkModeButton = document.querySelector(".theme-toggle");
const icon = darkModeButton.querySelector("img");

const ICONS = {
  light: "resources/moon.png",
  dark: "resources/sun.png",
};

function applyTheme(isDark) {
  root.classList.toggle("dark-mode", isDark);
  darkModeButton.setAttribute("aria-pressed", String(isDark));
  darkModeButton.setAttribute(
    "aria-label",
    isDark ? "Light mode" : "Dark mode",
  );
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
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(saved ? saved === "dark" : prefersDark);

darkModeButton.addEventListener("click", () => {
  applyTheme(!root.classList.contains("dark-mode"));
});
