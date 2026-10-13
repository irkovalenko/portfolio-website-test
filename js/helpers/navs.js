import { siteRoot } from "./paths.js";

export function getNavLinks() {
  const links = [...document.querySelectorAll("#header nav a[href]")];
  links.forEach((a) => {
    a.href = new URL(a.getAttribute("href"), siteRoot).href;
  });
  return links;
}

export function setActive(links, section) {
  links.forEach((a) => {
    const isActive = a.dataset.section === section;
    a.classList.toggle("active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}
