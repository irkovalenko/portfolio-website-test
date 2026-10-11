import { mouse_shrine } from "../../data/mouse_shrine.js";
import { createLightBoxGallery } from "../../components/galleryLightBox.js";
import { initImageModal } from "../../components/imageModal.js";
import "../../components/videoModal.js";

const resourcesUrl = new URL(
  "../../../js/projectContent/contests/",
  import.meta.url,
);

export function renderContests(container) {
  const [item] = mouse_shrine;

  const description = Array.isArray(item.description)
    ? item.description.map((p) => `<p>${p}</p>`).join("")
    : item.description;

  const stills = (item.images ?? [])
    .map((still) => {
      const src = new URL(still.file, resourcesUrl).href;
      const label = still.title ?? "";

      return `
        <li class="card">
          <a
            class="card-link image-modal-trigger"
            href="${src}"
            data-image="${src}"
            data-title="${label}"
            aria-label="${label}"
          >
            <div class="preview-box">
              <img
                src="${src}"
                alt="${label}"
                loading="lazy"
              >
            </div>
          </a>
        </li>
      `;
    })
    .join("");

  container.innerHTML = `
    <figure class="video-feature video-feature--youtube">
      <iframe
        src="https://www.youtube-nocookie.com/embed/${item.youtubeId}?rel=0"
        title="${item.title}"
        allow="encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
      ></iframe>
    </figure>

    <section class="work-info">
      <div class="work-description">
        ${description}
      </div>

      ${stills ? `<ul class="gallery gallery--landscape">${stills}</ul>` : ""}
    </section>

    ${createLightBoxGallery()}
  `;

  initImageModal(container);
}
