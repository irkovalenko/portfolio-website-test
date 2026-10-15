import { siteRoot } from "../helpers/paths.js";
import { loadJobs } from "./loadJobs.js";

export async function loadAbout() {
  const container = document.querySelector("#about");

  if (!container) return;

  const url = new URL("components/about.html", siteRoot);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load about: ${response.status}`);
  }

  container.innerHTML = await response.text();

  const jobsList = container.querySelector("#jobs-list");

  if (!jobsList) {
    console.error("#jobs-list not found");
    return;
  }

  loadJobs(jobsList);
}

loadAbout();
