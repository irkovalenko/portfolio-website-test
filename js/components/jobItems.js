import { t } from "../helpers/lang.js";

export function createJobItem(job) {
  return `
    <article class="experience-item">
      <p class="experience-dates">${job.dates}</p>
      <div>
        <h3 class="experience-company">${job.company}</h3>
        <p class="experience-role">${job.role}</p>
      </div>
      <p class="experience-text">${t(job.translationKey, job.text)}</p>
    </article>
  `;
}
