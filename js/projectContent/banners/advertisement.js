import { banners } from "../../data/advertisement.js";
import { createBannerGallery } from "../../components/bannerGallery.js";
import { fitPreviews } from "../../fitPreviews.js";
import "../../components/bannerModal.js";

export function renderBanners(container) {
  container.innerHTML = createBannerGallery(banners);
  fitPreviews(container);
}
