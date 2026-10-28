import z from "zod";
import { PagesConfig } from "~/domains/pageSchemas";
import {
  checkedOptional,
  checkedRequired,
} from "~/services/validation/checkedCheckbox";
import {
  createSplitDateSchemaOptional,
  createSplitDateSchema,
} from "~/services/validation/dateObject";
import { integerSchema } from "~/services/validation/integer";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

const nebenantragArraySchema = z.array(
  z.object({
    nebenantragArt: z.enum([
      "vorgerichtlicheAnwaltskosten",
      "mahnkosten",
      "inkassokosten",
      "adressermittlungskosten",
      "ruecklastschriftgebühren",
      "pauschale",
    ]),
    nebenantragBetrag: integerSchema,
    nebenantragZinssatzInProzent: integerSchema.optional(),
    nebenantragZinsmethode: z
      .enum([
        "jaehrlicherZinssatzUeberBasiszins",
        "jaehrlicherZinssatz",
        "monatlicherZinssatzUeberBasiszins",
        "monatlicherZinssatz",
      ])
      .optional(),
    nebenantragZinsbeginn: createSplitDateSchemaOptional(),
    nebenantragZinsende: createSplitDateSchemaOptional(),
  }),
);
const annahmeverzugArraySchema = z.array(
  z.object({
    annahmeverzugsFeststellung: checkedRequired,
    annahmeverzugDatum: createSplitDateSchema(),
  }),
);
const hauptantragArraySchema = z.array(
  z
    .object({
      internesSchlagwortFordureung: z.string().max(50).optional(),
      betragForderung: integerSchema,
      beklagte: checkedOptional,
      klagende: checkedOptional,
      zugUndZug: checkedOptional,
      beschreibungDerGegenleistung: stringOptionalSchema,
      zinssatzInProzent: integerSchema.optional(),
      zinsmethode: z
        .enum([
          "jaehrlicherZinssatzUeberBasiszins",
          "jaehrlicherZinssatz",
          "monatlicherZinssatzUeberBasiszins",
          "monatlicherZinssatz",
        ])
        .optional(),
      zinsbeginn: createSplitDateSchemaOptional(),
      zinsende: createSplitDateSchemaOptional(),
      nebenantrag: nebenantragArraySchema.optional(),
      annahmeverzug: annahmeverzugArraySchema.optional(),
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
  hauptantragUebersicht: {
    stepId:
      "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/uebersicht",
    arraySummary: {
      name: "hauptantrag",
      schema: hauptantragArraySchema,
      isArrayRelevant: () => true,
    },
  },
  hauptantragDaten: {
    stepId:
      "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/hauptantrag/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#internesSchlagwortFordureung":
        hauptantragArraySchema.element.shape.internesSchlagwortFordureung,
      "hauptantrag#betragForderung":
        hauptantragArraySchema.element.shape.betragForderung,
      "hauptantrag#beklagte": hauptantragArraySchema.element.shape.beklagte,
      "hauptantrag#klagende": hauptantragArraySchema.element.shape.klagende,
      "hauptantrag#zugUndZug": hauptantragArraySchema.element.shape.zugUndZug,
      "hauptantrag#beschreibungDerGegenleistung":
        hauptantragArraySchema.element.shape.beschreibungDerGegenleistung,
      "hauptantrag#zinssatzInProzent":
        hauptantragArraySchema.element.shape.zinssatzInProzent,
      "hauptantrag#zinsmethode":
        hauptantragArraySchema.element.shape.zinsmethode,
      "hauptantrag#zinsbeginn": hauptantragArraySchema.element.shape.zinsbeginn,
      "hauptantrag#zinsende": hauptantragArraySchema.element.shape.zinsende,
    },
  },
  hauptantragWarnung: {
    stepId:
      "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/warnung",
    shouldCollapseIntoParentNavItem: true,
  },
  nebenantragDaten: {
    stepId:
      "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/#/nebenantrag/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#nebenantrag#nebenantragArt":
        nebenantragArraySchema.element.shape.nebenantragArt,
      "hauptantrag#nebenantrag#nebenantragBetrag":
        nebenantragArraySchema.element.shape.nebenantragBetrag,
      "hauptantrag#nebenantrag#nebenantragZinssatzInProzent":
        nebenantragArraySchema.element.shape.nebenantragZinssatzInProzent,
      "hauptantrag#nebenantrag#nebenantragZinsmethode":
        nebenantragArraySchema.element.shape.nebenantragZinsmethode,
      "hauptantrag#nebenantrag#nebenantragZinsbeginn":
        nebenantragArraySchema.element.shape.nebenantragZinsbeginn,
      "hauptantrag#nebenantrag#nebenantragZinsende":
        nebenantragArraySchema.element.shape.nebenantragZinsende,
    },
  },
  annahmeverzugDaten: {
    stepId:
      "/haupt-und-nebenantraege/allgemeine-zahlungs-und-nebenantraege/#/annahmeverzug/#/daten",
    shouldCollapseIntoParentNavItem: true,
    pageSchema: {
      "hauptantrag#annahmeverzug#annahmeverzugsFeststellung":
        annahmeverzugArraySchema.element.shape.annahmeverzugsFeststellung,
      "hauptantrag#annahmeverzug#annahmeverzugDatum":
        annahmeverzugArraySchema.element.shape.annahmeverzugDatum,
    },
  },
} as const satisfies PagesConfig;
