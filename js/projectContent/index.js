export const projectContent = {
  advertisement: () =>
    import("./banners/advertisement.js").then((m) => m.renderBanners),
  hobby: () => import("./hobby/hobby.js").then((m) => m.renderHobby),
  web: () => import("./web/web.js").then((m) => m.renderWeb),
  animation: () =>
    import("./animation/animation.js").then((m) => m.renderAnimation),
  contests: () =>
    import("./contests/contests.js").then((m) => m.renderContests),
};
