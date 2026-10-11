const pagesUrl = new URL("../projectContent/banners/htmls/", import.meta.url);

export function createBannerCard(banner) {
  const href = new URL(banner.file, pagesUrl).href;

  return `
    <li class="card">
      <a
        class="card-link"
        href="${href}"
        data-video="${href}"
        data-title="${banner.title}"
        aria-label="${banner.title}"
      >
        <div class="preview-box">
          <iframe
            class="preview-frame"
            src="${href}"
            width="320"
            height="480"
            loading="lazy"
            scrolling="no"
            title="${banner.title}"
          ></iframe>
        </div>
      </a>
    </li>
  `;
}
