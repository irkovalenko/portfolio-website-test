export const siteRoot = new URL("../../", import.meta.url);

export const headerUrl = new URL("components/header.html", siteRoot);

export const assetUrl = (path) =>
  new URL(path.replace(/^\/+/, ""), siteRoot).href;

export const pageUrl = (path = "") =>
  new URL(path.replace(/^\/+/, ""), siteRoot).href;

export const normalize = (path) =>
  path.replace(/index\.html$/, "").replace(/\/?$/, "/");

export const isHomePage = () =>
  normalize(location.pathname) === normalize(siteRoot.pathname);
