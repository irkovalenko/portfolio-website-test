export const getHeaderHeight = () =>
  document.querySelector("#header .nav-container")?.offsetHeight ?? 0;

export function syncHeaderHeight() {
  const container = document.querySelector("#header .nav-container");
  if (!container) return;

  new ResizeObserver(() => {
    document.documentElement.style.setProperty(
      "--header-h",
      getHeaderHeight() + "px",
    );
  }).observe(container);
}
