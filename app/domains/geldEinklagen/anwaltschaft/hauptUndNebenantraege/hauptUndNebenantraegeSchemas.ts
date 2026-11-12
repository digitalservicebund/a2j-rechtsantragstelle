import { z } from "zod";
import { absaetzeArraySchema } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { annahmeverzugCheckboxZodDescription } from "~/services/validation/annahmeverzugCheckbox";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createDateInputOptionalSchema } from "~/services/validation/dateObject";
import { integerSchema } from "~/services/validation/integer";
import { klageParteiCheckboxesZodDescription } from "~/services/validation/klageParteiCheckboxes";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";

const optionalIntegerSchema = z
  .union([integerSchema, z.literal("")])
  .optional();

const optionalZinsmethodeSchema = z
  .union([
    z.enum([
      "jaehrlicherZinssatzUeberBasiszins",
      "jaehrlicherZinssatz",
      "monatlicherZinssatzUeberBasiszins",
      "monatlicherZinssatz",
    ]),
    z.literal(""),
  ])
  .optional();

const annahmeverzugCheckboxSchema = z
  .enum(["on", "off"])
  .or(z.undefined())
  .refine((value) => value === "on", {
    message: "Bitte wählen Sie den Feststellungsantrag Annahmeverzug aus",
  });

export const annahmeverzugSchema = z.object({
  type: z.literal("annahmeverzug"),
  annahmeverzugsFeststellung: annahmeverzugCheckboxSchema.describe(
    annahmeverzugCheckboxZodDescription,
  ),
  annahmeverzugDatum: createDateInputOptionalSchema(),
  absaetze: absaetzeArraySchema.optional(),
});

export const nebenantragSchema = z.object({
  type: z.literal("nebenantrag"),
  nebenantragArt: z.enum([
    "vorgerichtlicheAnwaltskosten",
    "mahnkosten",
    "inkassokosten",
    "adressermittlungskosten",
    "ruecklastschriftgebühren",
    "pauschale",
  ]),
  nebenantragBetrag: buildMoneyValidationSchema(),
  nebenantragZinssatzInProzent: optionalIntegerSchema,
  nebenantragZinsmethode: optionalZinsmethodeSchema,
  nebenantragZinsbeginn: createDateInputOptionalSchema().optional(),
  nebenantragZinsende: createDateInputOptionalSchema().optional(),
  absaetze: absaetzeArraySchema.optional(),
});

const nebenantraegeArraySchema = z.array(
  z.discriminatedUnion("type", [nebenantragSchema, annahmeverzugSchema]),
);

export type Nebenantrag = z.infer<typeof nebenantraegeArraySchema>[number];

const selectedBeklagteSchema = z
  .record(z.uuid(), z.enum(["on", "off"]))
  .refine(
    (parties) => Object.values(parties).includes("on"),
    "Bitte wählen Sie mindestens eine Beklagte aus",
  )
  .describe(klageParteiCheckboxesZodDescription);

const selectedKlagendeSchema = z
  .record(z.uuid(), z.enum(["on", "off"]))
  .refine(
    (parties) => Object.values(parties).includes("on"),
    "Bitte wählen Sie mindestens eine Klagende aus",
  )
  .describe(klageParteiCheckboxesZodDescription);

export const hauptantraegeArraySchema = z.array(
  z.object({
    id: z.string().check(z.uuid()).optional(),
    internesSchlagwortForderung: z.string().max(50).optional(),
    betragForderung: buildMoneyValidationSchema(),
    klagende: selectedKlagendeSchema,
    beklagte: selectedBeklagteSchema,
    zugUndZug: checkedOptional.optional(),
    beschreibungDerGegenleistung: stringOptionalSchema,
    zinssatzInProzent: optionalIntegerSchema,
    zinsmethode: optionalZinsmethodeSchema,
    zinsbeginn: createDateInputOptionalSchema(),
    zinsende: createDateInputOptionalSchema(),
    absaetze: absaetzeArraySchema.optional(),
    nebenantraege: nebenantraegeArraySchema.optional(),
  }),
);

export type Hauptantraege = z.infer<typeof hauptantraegeArraySchema>[number];

export const schmerzengeldNebenantragSchema = z.object({
  schmerzengeldNebenantragArt: z.enum([
    "vorgerichtlicheAnwaltskosten",
    "mahnkosten",
    "inkassokosten",
    "adressermittlungskosten",
    "ruecklastschriftgebühren",
    "pauschale",
  ]),
  schmerzengeldNebenantragBetrag: buildMoneyValidationSchema(),
  schmerzengeldNebenantragZinssatzInProzent: optionalIntegerSchema,
  schmerzengeldNebenantragZinsmethode: optionalZinsmethodeSchema,
  schmerzengeldNebenantragZinsbeginn:
    createDateInputOptionalSchema().optional(),
  schmerzengeldNebenantragZinsende: createDateInputOptionalSchema().optional(),
  absaetze: absaetzeArraySchema.optional(),
});

export type SchmerzengeldNebenantrag = z.infer<
  typeof schmerzengeldNebenantragSchema
>;

export const schmerzengeldantragSchema = z.array(
  z.object({
    id: z.string().check(z.uuid()).optional(),
    internesSchlagwortForderung: z.string().max(50).optional(),
    mindestBetrag: buildMoneyValidationSchema(),
    klagende: selectedKlagendeSchema,
    beklagte: selectedBeklagteSchema,
    zinsmethode: optionalZinsmethodeSchema,
    zinssatzInProzent: optionalIntegerSchema,
    zinsbeginn: createDateInputOptionalSchema(),
    zinsende: createDateInputOptionalSchema(),
    absaetze: absaetzeArraySchema.optional(),
    nebenantraege: z.array(schmerzengeldNebenantragSchema).optional(),
  }),
);

export type Schmerzensgeldantrag = z.infer<
  typeof schmerzengeldantragSchema
>[number];
