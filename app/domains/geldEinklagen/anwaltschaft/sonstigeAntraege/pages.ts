import z from "zod";
import type { PagesConfig } from "~/domains/pageSchemas";
import { hiddenInputSchema } from "~/services/validation/hiddenInput";
import { antragIdSchema } from "~/domains/geldEinklagen/anwaltschaft/hauptUndNebenantraege/hauptUndNebenantraegeSchemas";
import { stringRequiredMaxSchema } from "~/services/validation/stringRequired";

const sonstigeAntraegeArraySchema = z.array(
  z.object({
    internesSchlagwort: z.string().max(50).optional(),
    antrag: stringRequiredMaxSchema({ max: 2000 }),
    id: antragIdSchema,
  }),
);

export const sonstigeAntraegePages = {
  sonstigeAntraegeUebersicht: {
    stepId: "/sonstige-antraege/uebersicht",
    arraySummary: {
      name: "sonstigeAntraege",
      schema: sonstigeAntraegeArraySchema,
      isArrayRelevant: () => true,
    },
  },
  sonstigeAntraegeAntragDaten: {
    stepId: "/sonstige-antraege/antrag/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "sonstigeAntraege#internesSchlagwort":
        sonstigeAntraegeArraySchema.element.shape.internesSchlagwort,
      "sonstigeAntraege#antrag":
        sonstigeAntraegeArraySchema.element.shape.antrag,
      "sonstigeAntraege#id": hiddenInputSchema(antragIdSchema),
    },
  },
} as const satisfies PagesConfig;
