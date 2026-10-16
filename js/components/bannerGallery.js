import { createBannerCard } from "./bannerCard.js";

const SECTIONS = [
  { key: "interactive", title: "Click &amp; interact", modifier: "purple" },
  { key: "static", title: "Static", modifier: "green" },
];

function createSection({ title, modifier }, items) {
  if (!items.length) return "";

  return `
    <section class="banner-section banner-section--${modifier}">
      <h2 class="banner-section-title">${title}</h2>
      <ul class="gallery">${items.map(createBannerCard).join("")}</ul>
    </section>
  `;
}

export function createBannerGallery(list) {
  const groups = {
    interactive: list.filter((b) => b.interactive),
    static: list.filter((b) => !b.interactive),
  };

  return SECTIONS.map((s) => createSection(s, groups[s.key])).join("");
}
