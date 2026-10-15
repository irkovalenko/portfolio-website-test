import { loadJobs } from "./loadJobs.js";

export async function loadAbout() {
  const container = document.querySelector("#about");

  if (!container) return;

  const response = await fetch("../../components/about.html");
  container.innerHTML = await response.text();

  const jobsList = container.querySelector("#jobs-list");

  if (!jobsList) {
    console.error("#jobs-list not found");
    return;
  }

  loadJobs(jobsList);
}

loadAbout();
