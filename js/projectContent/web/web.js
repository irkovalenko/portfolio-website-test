import { createLightBoxGallery } from "../../components/galleryLightBox.js";
import { initImageModal } from "../../components/imageModal.js";

export function renderWeb(slot) {
  slot.innerHTML = `
    <div class="perelyn-gallery">

      <div class="perelyn-stage perelyn-stage--hero">
        <a
          href="/testing-Mysz-banners/js/projectContent/web/perelyn.png"
          class="perelyn-image-link image-modal-trigger"
          data-image="/testing-Mysz-banners/js/projectContent/web/perelyn.png"
          data-title="website homepage"
        >
          <img
            src="/testing-Mysz-banners/js/projectContent/web/perelyn.png"
            class="perelyn-image-home-page"
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
            href="/testing-Mysz-banners/js/projectContent/web/image_1.jpg"
            class="perelyn-image-link image-modal-trigger"
            data-image="/testing-Mysz-banners/js/projectContent/web/image_1.jpg"
            data-title="placeholder text"
          >
            <img
              src="/testing-Mysz-banners/js/projectContent/web/image_1.jpg"
              class="perelyn-image-1"
            />
          </a>
        </div>

        <div class="perelyn-stage">
          <a
            href="/testing-Mysz-banners/js/projectContent/webimage_2.jpg"
            class="perelyn-image-link image-modal-trigger"
            data-image="/testing-Mysz-banners/resources/projects/web_layout/image_2.jpg"
            data-title="placeholder text"
          >
            <img
              src="/testing-Mysz-banners/js/projectContent/web/image_2.jpg"
              class="perelyn-image-2"
            />
          </a>
        </div>

      </div>

    </div>

    ${createLightBoxGallery()}
  `;

  initImageModal(slot);
}
