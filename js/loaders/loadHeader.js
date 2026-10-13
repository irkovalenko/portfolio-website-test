import { loadComponent } from "./loadComponent.js";
import { headerUrl } from "../helpers/paths.js";
import { getNavLinks } from "../helpers/navs.js";
import { trackActiveSection } from "../helpers/activeSection.js";
import { syncHeaderHeight } from "../helpers/headerHeight.js";
import { initScrolling } from "../helpers/scroll.js";
import { initTheme } from "../helpers/theme.js";

await loadComponent("header", headerUrl);

const links = getNavLinks();

trackActiveSection(links);
syncHeaderHeight();
initScrolling(links);
initTheme();
