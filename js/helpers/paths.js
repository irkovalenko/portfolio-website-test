export const siteRoot = new URL("../../", import.meta.url);
export const headerUrl = new URL(
  "../../components/header.html",
  import.meta.url,
);

export const normalize = (path) => path.replace(/index\.html$/, "");

export const isHomePage = () =>
  normalize(location.pathname) === normalize(siteRoot.pathname);
