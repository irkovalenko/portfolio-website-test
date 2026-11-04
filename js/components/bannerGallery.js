import { getLang } from "../helpers/lang.js";
import { createBannerCard } from "./bannerCard.js";

const SECTIONS = [
  {
    key: "interactive",
    title: { en: "Click & interact", pl: "Kliknij i odkryj" },
    modifier: "purple",
  },
  {
    key: "static",
    title: { en: "Gallery", pl: "Galeria" },
    modifier: "green",
  },
];

function resolveLabel(value) {
  const lang = getLang();

  if (typeof value === "object" && value !== null) {
    return value[lang] ?? value.en ?? value.pl ?? "";
  }

  return value ?? "";
}

function createSection({ title, modifier }, items) {
  return `
    <section class="banner-section banner-section--${modifier} raster-dots">
      <div class="profile-card-header">
        <span class="profile-card-label">${resolveLabel(title)}</span>
      </div>
      <ul class="gallery">${items.map(createBannerCard).join("")}</ul>
    </section>
  `;
}

export function createBannerGallery(list) {
  const groups = {
    interactive: list.filter((b) => b.interactive),
    static: list.filter((b) => !b.interactive),
  };

  const active = SECTIONS.filter((s) => groups[s.key].length);
  const columns = active.map((s) => `${groups[s.key].length}fr`).join(" ");

  return `
    <div class="banner-grid" style="--banner-columns: ${columns}">
      ${active.map((s) => createSection(s, groups[s.key])).join("")}
    </div>
  `;
}
