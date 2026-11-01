import { loadDict, localizeProject } from "../helpers/lang.js";
import { createProjectCard } from "../components/projectCard.js";
import { workHeader } from "../components/workHeader.js";
import { projects } from "../data/projects.js";

await loadDict();

const work = document.querySelector("#work");
const grid = document.querySelector("#work-grid");

if (work) work.insertAdjacentHTML("afterbegin", workHeader());
if (grid)
  grid.innerHTML = projects
    .map(localizeProject)
    .map(createProjectCard)
    .join("");
