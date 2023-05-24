import type { NavigationItem } from "~/services/cms/models/pageComponents";
import type { Footer } from "./Footer";

export type Navigation = {
  locale: "de";
  tree: NavigationItem[];
};

export type SingleComponentCMS = Footer | Navigation;
