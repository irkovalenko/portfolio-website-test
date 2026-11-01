import { t } from "../helpers/lang.js";
export function workHeader() {
  return `
<div class="work-header">
          <div>
            <p class="work-eyebrow" lang="ja">
              ${t("work.eyebrow")}
            </p>
            <h2 class="work-title">
              ${t("work.title")}
            </h2>
          </div>
          <p class="work-intro">
          ${t("work.intro")}
          </p>
        </div>`;
}
