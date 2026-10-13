import { isHomePage } from "./paths.js";
import { setActive } from "./navs.js";

const SECTIONS = [
  { key: "home", selector: "#hero" },
  { key: "about", selector: "#about" },
  { key: "projects", selector: "#work" },
];

export function trackActiveSection(links) {
  const declared = document.body.dataset.section;
  if (declared) return setActive(links, declared);

  if (!isHomePage()) return;

  const update = () => {
    const line = window.innerHeight * 0.35;
    let current = "home";

    for (const { key, selector } of SECTIONS) {
      const el = document.querySelector(selector);
      if (el && el.getBoundingClientRect().top <= line) current = key;
    }

    const atBottom =
      window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    if (atBottom) current = SECTIONS[SECTIONS.length - 1].key;

    setActive(links, current);
  };

  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
  new ResizeObserver(update).observe(document.body);
  update();
}
