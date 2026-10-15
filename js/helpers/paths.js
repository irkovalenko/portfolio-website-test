export const siteRoot = new URL("../../", import.meta.url);

export const headerUrl = new URL("components/header.html", siteRoot);

export const homeUrl = new URL("home/", siteRoot);

export const normalize = (path) =>
  path.replace(/index\.html$/, "").replace(/\/?$/, "/");

export const isHomePage = () =>
  normalize(location.pathname) === normalize(homeUrl.pathname);
