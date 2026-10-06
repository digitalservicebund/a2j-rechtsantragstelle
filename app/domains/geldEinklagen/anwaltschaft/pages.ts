import { type PagesConfig } from "~/domains/pageSchemas";

export const geldEinklagenAnwaltschaftPages = {
  voraussetzungen: {
    stepId: "/voraussetzungen/intro",
    // shouldCollapseIntoParentNavItem: true,
  },
  //   downloadKlageschrift: {
  //     stepId: "/klageschrift-herunterladen",
  //   },
} as const satisfies PagesConfig;

export type GeldEinklagenAnwaltschaftPages =
  typeof geldEinklagenAnwaltschaftPages;
