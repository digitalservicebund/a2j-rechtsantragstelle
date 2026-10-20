import z from "zod";
import { PagesConfig } from "~/domains/pageSchemas";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createSplitDateSchemaOptional } from "~/services/validation/dateObject";
import { integerSchema } from "~/services/validation/integer";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

const allgemeineZahlungsUndNebenantraegeArraySchema = z.array(
  z
    .object({
      internesSchlagwortFordureung: z.string().max(50).optional(),
      betragForderung: integerSchema,
      beklagt: checkedOptional,
      klagend: checkedOptional,
      zugUndZug: checkedOptional,
      beschreibungDerGegenleistung: stringOptionalSchema,
      zinssatzInProzent: integerSchema.optional(),
      zinsmethode: z
        .enum([
          "Jährlicher Zinssatz über Basiszins",
          "Jährlicher Zinssatz",
          "Monatlicher Zinssatz über Basiszins",
          "Monatlicher Zinssatz",
        ])
        .optional(),
      zinsbeginn: createSplitDateSchemaOptional,
      zinsende: createSplitDateSchemaOptional,
    })
    .superRefine((data, ctx) => {
      const hasZinssatz =
        data.zinssatzInProzent !== undefined && data.zinssatzInProzent !== null;

      const hasZinsmethode =
        data.zinsmethode !== undefined && data.zinsmethode !== null;

      // Zinssatz entered -> Zinsmethode required
      if (hasZinssatz && !hasZinsmethode) {
        ctx.addIssue({
          code: "custom",
          path: ["zinsmethode"],
          message: "Bitte geben Sie eine Zinsmethode an",
        });
      }

      // Zinsmethode selected -> Zinssatz required
      if (hasZinsmethode && !hasZinssatz) {
        ctx.addIssue({
          code: "custom",
          path: ["zinssatzInProzent"],
          message: "Bitte geben Sie einen Zinssatz an",
        });
      }
      if (hasZinsmethode && !hasZinssatz) {
        ctx.addIssue({
          code: "custom",
          path: ["zinssatzInProzent"],
          message: "Bitte geben Sie einen Zinssatz an",
        });
      }
    }),
);

export const hauptUndNebenantraegePages = {
  allgemeineZahlungsUndNebenantraegeUebersicht: {
    stepId:
      "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht",
    // arraySummary: {
    //   name: "allgemeineZahlungsUndNebenantraege",
    //   arraySchema: allgemeineZahlungsUndNebenantraegeArraySchema,
    //   isArrayRelevant: () => true,
    // },
  },
  allgemeineZahlungsUndNebenantraegeWarnung: {
    stepId:
      "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
} as const satisfies PagesConfig;
