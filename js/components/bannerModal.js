import { openMedia } from "./modal.js";

function openBanner(link) {
  const gallery = link.closest(".gallery");
  const links = gallery ? [...gallery.querySelectorAll(".card-link")] : [link];
  const i = links.indexOf(link);
  const go = (step) => () =>
    openBanner(links[(i + step + links.length) % links.length]);

  openMedia({
    type: "iframe",
    src: link.dataset.video,
    title: link.dataset.title ?? "",
    group: link.closest(".banner-section--purple") ? "purple" : "green",
    prev: links.length > 1 ? go(-1) : null,
    next: links.length > 1 ? go(1) : null,
  });
}

document.addEventListener("click", (e) => {
  const trigger = e.target.closest(".card-link");
  if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey) return;

  e.preventDefault();
  openBanner(trigger);
});
