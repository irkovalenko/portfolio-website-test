import { siteRoot } from "../helpers/paths.js";
import { applyTranslations, getLang, loadDict } from "../helpers/lang.js";
import { glue } from "https://esm.sh/@typehug/all";
import { justify } from "../helpers/justify.js";
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
  await loadDict();
  applyTranslations(container);

  const lang = getLang() === "pl" ? "pl" : "en";
  const intro = container.querySelector(".profile-intro");
  if (intro) intro.textContent = glue(intro.textContent, { locale: lang });
  void justify(
    container.querySelector(".profile-card-content"),
    lang,
    ".profile-intro",
  );

  loadTools();
}

loadCardsSection();
