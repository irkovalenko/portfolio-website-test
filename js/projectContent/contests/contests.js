import { glue } from "https://esm.sh/@typehug/all";
import { mouse_shrine } from "../../data/mouse_shrine.js";
import { createLightBoxGallery } from "../../components/galleryLightBox.js";
import { initImageModal } from "../../components/imageModal.js";
import { getLang } from "../../helpers/lang.js";
import { justify } from "../../helpers/justify.js";
import "../../components/videoModal.js";

const resourcesUrl = new URL(
  "../../../js/projectContent/contests/",
  import.meta.url,
);

export function renderContests(container) {
  const [item] = mouse_shrine;
  const rawDescription =
    typeof item.description === "object" && item.description !== null
      ? (item.description[getLang()] ??
        item.description.en ??
        item.description.pl ??
        "")
      : item.description;

  const lang = getLang() === "pl" ? "pl" : "en";

  const description = Array.isArray(rawDescription)
    ? rawDescription.map((p) => `<p>${glue(p, { locale: lang })}</p>`).join("")
    : `<p>${glue(rawDescription, { locale: lang })}</p>`;

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
      <div class="work-description" lang="${lang}">
        ${description}
      </div>

      ${stills ? `<ul class="gallery gallery--landscape">${stills}</ul>` : ""}
    </section>

    ${createLightBoxGallery()}
  `;

  initImageModal(container);
  justify(container.querySelector(".work-description"), lang);
}
