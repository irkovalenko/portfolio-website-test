import { animation } from "../../data/animation.js";

const resourcesUrl = new URL(
  "../../../js/projectContent/animation/",
  import.meta.url,
);

export function renderAnimation(container) {
  const [item] = animation;
  const src = new URL(item.file, resourcesUrl).href;

  container.innerHTML = `
    <figure class="video-feature">
      <video src="${src}" title="${item.title}"autoplay muted loop playsinline preload="auto"></video>
    </figure>
  `;
}
