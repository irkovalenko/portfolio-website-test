import { loadTools } from "./loadTools.js";

export async function loadCardsSection() {
  const container = document.querySelector("#cards-section");
  if (!container) return;

  const response = await fetch("../../components/cards_section.html");
  container.innerHTML = await response.text();

  loadTools();
}

loadCardsSection();
