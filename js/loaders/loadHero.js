import { loadComponent } from "./loadComponent.js";
import { siteRoot } from "../helpers/paths.js";

const heroUrl = new URL("components/hero.html", siteRoot);

await loadComponent("hero", heroUrl);

const alignStaticUnderY = () => {
  const anchor = document.querySelector("#hero .line-anchor");
  const staticLine = document.querySelector("#hero .line--pink");

  if (!anchor || !staticLine) return;

  if (window.innerWidth >= 640) {
    staticLine.style.removeProperty("--hero-static-offset");
    return;
  }

  staticLine.style.setProperty("--hero-static-offset", "0px");

  const offset =
    anchor.getBoundingClientRect().left -
    staticLine.getBoundingClientRect().left;

  staticLine.style.setProperty("--hero-static-offset", `${offset}px`);
};

alignStaticUnderY();

window.addEventListener("resize", alignStaticUnderY);
document.fonts.ready.then(alignStaticUnderY);

const heroResizeObserver = new ResizeObserver(alignStaticUnderY);

const anchor = document.querySelector("#hero .line-anchor");
const pinkLine = document.querySelector("#hero .line--pink");

if (anchor && pinkLine) {
  heroResizeObserver.observe(anchor);
  heroResizeObserver.observe(pinkLine);
}

document.querySelectorAll("#hero nav a[href]").forEach((a) => {
  const relativeHref = a.getAttribute("href");

  a.href = new URL(
    relativeHref,
    relativeHref.startsWith("#") ? homeUrl : siteRoot,
  ).href;
});
