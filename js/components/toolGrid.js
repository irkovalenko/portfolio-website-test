import { siteRoot } from "../helpers/paths.js";

export function createToolGrid(tool) {
  const src = new URL(`resources/tools/${tool.image}`, siteRoot).href;

  return `
    <div class="tool" title="${tool.name}">
      <div class="tool-button">
        <img src="${src}" alt="${tool.name}" />
      </div>
      <span class="tool-tip">${tool.name}</span>
    </div>
  `;
}
