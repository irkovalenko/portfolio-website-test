import { getLang, loadDict, localizeProject } from "../helpers/lang.js";
import { justify } from "../helpers/justify.js";
import { createProjectCard } from "../components/projectCard.js";
import { workHeader } from "../components/workHeader.js";
import { projects } from "../data/projects.js";

await loadDict();

const work = document.querySelector("#work");
const grid = document.querySelector("#work-grid");

if (work) {
  work.insertAdjacentHTML("afterbegin", workHeader());
  void justify(work.querySelector(".work-header"), getLang(), ".work-intro");
}

if (grid)
  grid.innerHTML = projects
    .map(localizeProject)
    .map(createProjectCard)
    .join("");