import { projects } from "../data/projects.js";
import { loadDict, localizeProject } from "../helpers/lang.js";
import { createProjectPage } from "../components/projectPage.js";
import { projectContent } from "../projectContent/index.js";
import { openMedia } from "../components/modal.js";

const root = document.querySelector("#project");
if (!root) throw new Error('Missing <div id="project"></div> in project.html');

await loadDict();

const slug = document.body.dataset.slug;
const found = projects.find((item) => item.slug === slug);

if (!found) {
  root.innerHTML = `<p>Project not found.</p>`;
} else {
  const project = localizeProject(found);
  document.title = project.title.replace("\n", " ");
  root.innerHTML = createProjectPage(project);

  const loadContent = projectContent[project.slug];
  const slot = root.querySelector("#project-content");

  if (loadContent && slot) {
    try {
      const render = await loadContent();
      render(slot, project);
    } catch (err) {
      console.error(`Could not load content for "${project.slug}"`, err);
      slot.innerHTML = `<p>Content failed to load.</p>`;
    }
  }
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-media-src]");

  if (!trigger) return;

  openMedia({
    type: "iframe",
    src: trigger.dataset.mediaSrc,
    title: trigger.dataset.mediaTitle || "",
  });
});
