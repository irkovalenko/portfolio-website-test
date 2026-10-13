import { isHomePage, normalize } from "./paths.js";
import { getHeaderHeight } from "./headerHeight.js";

const USER_EVENTS = ["wheel", "touchstart", "keydown"];

function scrollToId(id, behavior = "instant") {
  const el = document.getElementById(id);
  if (!el) return false;
  const top =
    el.getBoundingClientRect().top + window.scrollY - getHeaderHeight();
  window.scrollTo({ top, behavior });
  return true;
}

let stopCurrent = () => {};

function keepAligned(id, ms) {
  stopCurrent();

  const ro = new ResizeObserver(() => scrollToId(id));
  ro.observe(document.body);

  const stop = () => {
    ro.disconnect();
    clearTimeout(timer);
    USER_EVENTS.forEach((evt) => removeEventListener(evt, stop));
    stopCurrent = () => {};
  };

  const timer = setTimeout(stop, ms);
  USER_EVENTS.forEach((evt) => addEventListener(evt, stop, { passive: true }));
  stopCurrent = stop;
}

function alignOnLoad() {
  if (!location.hash) return;

  history.scrollRestoration = "manual";
  const id = decodeURIComponent(location.hash.slice(1));

  scrollToId(id);
  addEventListener("load", () => scrollToId(id));
  keepAligned(id, 3000);
}

function handleLinkClicks(links) {
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = new URL(a.href);
      if (normalize(url.pathname) !== normalize(location.pathname)) return;

      e.preventDefault();

      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (scrollToId(id, "smooth")) keepAligned(id, 1500);
        history.pushState(null, "", url.hash);
      } else {
        stopCurrent();
        scrollTo({ top: 0, behavior: "smooth" });
        history.pushState(null, "", location.pathname);
      }
    });
  });
}

export function initScrolling(links) {
  if (!isHomePage()) return;
  alignOnLoad();
  handleLinkClicks(links);
}
