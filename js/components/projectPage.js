import { t } from "../helpers/lang.js";

export function createProjectPage(project) {
  return `
    <section class="project-hero">
      <div>
        <p class="project-number">${project.number} · ${project.discipline}</p>
        <h1 class="project-title">${project.title}</h1>
        <img class="project-icon" src="${project.icon}" />
      </div>
      <div class="project-info">
        <p class="project-description">${project.description}</p>
        <div class="project-meta">
          <span>${t("project.role", "Role")}<br /><b>${project.role}</b></span>
          <span>${t("project.year", "Year")}<br /><b>${project.year}</b></span>
        </div>
      </div>
      <div class="project-subtitles">
      <h3 class="project-subtitle-japanese">${project.subtitleJapanese}</h3>
      <h2 class="project-subtitle">${project.subtitle}</h2>
      </div>
    </section>

    <div class="project-content" id="project-content"></div>
  `;
}
