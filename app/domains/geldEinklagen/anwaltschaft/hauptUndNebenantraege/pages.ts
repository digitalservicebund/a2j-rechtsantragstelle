import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { stringRequiredMaxSchema } from "~/services/validation/stringRequired";

const sonstigeNebenUndProzessantraegeArraySchema = z.array(
  z.object({
    internesSchlagwort: z.string().max(50).optional(),
    antrag: stringRequiredMaxSchema({ max: 2000 }),
  }),
);

export const hauptUndNebenantraegePages = {
  sonstigeNebenUndProzessantraegeUebersicht: {
    stepId:
      "/haupt-und-nebenantraege/sonstige-neben-und-prozessantraege/uebersicht",
    arraySummary: {
      name: "sonstigeNebenUndProzessantraege",
      schema: sonstigeNebenUndProzessantraegeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  sonstigeNebenUndProzessantraegeAntrag: {
    stepId:
      "/haupt-und-nebenantraege/sonstige-neben-und-prozessantraege/antrag/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "sonstigeNebenUndProzessantraege#internesSchlagwort":
        sonstigeNebenUndProzessantraegeArraySchema.element.shape
          .internesSchlagwort,
      "sonstigeNebenUndProzessantraege#antrag":
        sonstigeNebenUndProzessantraegeArraySchema.element.shape.antrag,
    },
  },
} as const satisfies PagesConfig;

export type HauptUndNebenantraegePages = typeof hauptUndNebenantraegePages;
