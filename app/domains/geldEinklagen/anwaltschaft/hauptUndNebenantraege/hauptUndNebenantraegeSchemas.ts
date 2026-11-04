import { z } from "zod";
import { absaetzeArraySchema } from "~/domains/geldEinklagen/anwaltschaft/tatsachenvortrag/tatsachenvortragSchemas";
import { annahmeverzugCheckboxZodDescription } from "~/services/validation/annahmeverzugCheckbox";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createDateInputOptionalSchema } from "~/services/validation/dateObject";
import { integerSchema } from "~/services/validation/integer";
import { klageParteiCheckboxesZodDescription } from "~/services/validation/klageParteiCheckboxes";
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
  nebenantragBetrag: integerSchema,
  nebenantragZinssatzInProzent: optionalIntegerSchema,
  nebenantragZinsmethode: optionalZinsmethodeSchema,
  nebenantragZinsbeginn: createDateInputOptionalSchema(),
  nebenantragZinsende: createDateInputOptionalSchema(),
  absaetze: absaetzeArraySchema.optional(),
});

const nebenantragArraySchema = z.array(
  z.discriminatedUnion("type", [nebenantragSchema, annahmeverzugSchema]),
);

export type Nebenantrag = z.infer<typeof nebenantragArraySchema>[number];

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
  z.object({
    id: z.string().check(z.uuid()).optional(),
    internesSchlagwortFordureung: z.string().max(50).optional(),
    betragForderung: integerSchema,
    klagende: selectedKlagendeSchema,
    beklagte: selectedBeklagteSchema,
    zugUndZug: checkedOptional.optional(),
    beschreibungDerGegenleistung: stringOptionalSchema,
    zinssatzInProzent: optionalIntegerSchema,
    zinsmethode: optionalZinsmethodeSchema,
    zinsbeginn: createDateInputOptionalSchema(),
    zinsende: createDateInputOptionalSchema(),
    absaetze: absaetzeArraySchema.optional(),
    nebenantrag: nebenantragArraySchema.optional(),
  }),
);
