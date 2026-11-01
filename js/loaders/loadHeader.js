import { loadComponent } from "./loadComponent.js";
import { headerUrl } from "../helpers/paths.js";
import { loadDict } from "../helpers/lang.js";
import { initI18n } from "../helpers/lang.js";
import { getNavLinks } from "../helpers/navs.js";
import { trackActiveSection } from "../helpers/activeSection.js";
import { syncHeaderHeight } from "../helpers/headerHeight.js";
import { initScrolling } from "../helpers/scroll.js";
import { initTheme } from "../helpers/theme.js";

await loadComponent("header", headerUrl);
await initI18n();
await loadDict();

const links = getNavLinks();

trackActiveSection(links);
syncHeaderHeight();
initScrolling(links);
initTheme();
