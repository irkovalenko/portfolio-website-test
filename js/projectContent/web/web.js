import { siteRoot } from "../helpers/paths.js";
import { createLightBoxGallery } from "../../components/galleryLightBox.js";
import { initImageModal } from "../../components/imageModal.js";

export function renderWeb(slot) {
  const imageBase = new URL("js/projectContent/web/", siteRoot);

  const perelyn = new URL("perelyn.png", imageBase).href;
  const image1 = new URL("image_1.jpg", imageBase).href;
  const image2 = new URL("image_2.jpg", imageBase).href;

  slot.innerHTML = `
    <div class="perelyn-gallery">

      <div class="perelyn-stage perelyn-stage--hero">
        <a
          href="${perelyn}"
          class="perelyn-image-link image-modal-trigger"
          data-image="${perelyn}"
          data-title="website homepage"
        >
          <img
            src="${perelyn}"
            class="perelyn-image-home-page"
            alt="Perelyn website homepage"
          />
        </a>

        <a
          href="https://www.perelyn.com/"
          target="_blank"
          rel="noopener noreferrer"
          class="perelyn-link"
        >
          Visit website
        </a>
      </div>

      <div class="perelyn-secondary-grid">

        <div class="perelyn-stage">
          <a
            href="${image1}"
            class="perelyn-image-link image-modal-trigger"
            data-image="${image1}"
            data-title="placeholder text"
          >
            <img
              src="${image1}"
              class="perelyn-image-1"
              alt="Perelyn website screenshot 1"
            />
          </a>
        </div>

        <div class="perelyn-stage">
          <a
            href="${image2}"
            class="perelyn-image-link image-modal-trigger"
            data-image="${image2}"
            data-title="placeholder text"
          >
            <img
              src="${image2}"
              class="perelyn-image-2"
              alt="Perelyn website screenshot 2"
            />
          </a>
        </div>

      </div>

    </div>

    ${createLightBoxGallery()}
  `;

  initImageModal(slot);
}
