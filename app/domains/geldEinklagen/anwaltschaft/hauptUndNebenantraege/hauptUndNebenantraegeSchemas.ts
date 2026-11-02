import { z } from "zod";
import { absaetzeArraySchema } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import {
  checkedOptional,
  checkedRequired,
} from "~/services/validation/checkedCheckbox";
import {
  createSplitDateSchema,
  createSplitDateSchemaOptional,
} from "~/services/validation/dateObject";
import { integerSchema } from "~/services/validation/integer";
import { klageParteiCheckboxesZodDescription } from "~/services/validation/klageParteiCheckboxes";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

export const nebenantragArraySchema = z.array(
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
    absaetze: absaetzeArraySchema.optional(),
  }),
);
export const annahmeverzugArraySchema = z.array(
  z.object({
    annahmeverzugsFeststellung: checkedRequired,
    annahmeverzugDatum: createSplitDateSchema(),
    absaetze: absaetzeArraySchema.optional(),
  }),
);
const selectedBeklagteSchema = z
  .record(z.uuid(), z.enum(["on", "off"]))
  .refine(
    (parties) => Object.values(parties).some((value) => value === "on"),
    "Bitte wählen Sie mindestens eine Beklagte aus",
  )
  .describe(klageParteiCheckboxesZodDescription);

const selectedKlagendeSchema = z
  .record(z.uuid(), z.enum(["on", "off"]))
  .refine(
    (parties) => Object.values(parties).some((value) => value === "on"),
    "Bitte wählen Sie mindestens eine Klagende aus",
  )
  .describe(klageParteiCheckboxesZodDescription);

export const hauptantragArraySchema = z.array(
  z
    .object({
      internesSchlagwortFordureung: z.string().max(50).optional(),
      betragForderung: integerSchema,
      klagende: selectedKlagendeSchema,
      beklagte: selectedBeklagteSchema,
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
      absaetze: absaetzeArraySchema.optional(),
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
