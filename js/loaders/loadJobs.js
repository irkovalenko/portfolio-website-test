import { createJobItem } from "../components/jobItems.js";
import { jobs } from "../data/jobs.js";
import { loadDict } from "../helpers/lang.js";

export async function loadJobs(container) {
  await loadDict();
  container.innerHTML = jobs.map(createJobItem).join("");
}
