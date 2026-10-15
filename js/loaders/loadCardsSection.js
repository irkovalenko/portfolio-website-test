import { siteRoot } from "../helpers/paths.js";
import { loadTools } from "./loadTools.js";

export async function loadCardsSection() {
  const container = document.querySelector("#cards-section");
  if (!container) return;

  const url = new URL("components/cards_section.html", siteRoot);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load cards section: ${response.status}`);
  }

  container.innerHTML = await response.text();

  loadTools();
}

loadCardsSection();
