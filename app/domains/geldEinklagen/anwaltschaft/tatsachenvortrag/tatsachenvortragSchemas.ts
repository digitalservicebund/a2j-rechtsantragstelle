import z from "zod";
import {
  adresseFields,
  personFields,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { stringRequiredMaxSchema } from "~/services/validation/stringRequired";

export const MAX_ABSAETZE = 50;
export const MAX_BEWEISE = 50;

export const augenscheinSchema = z.object({
  beweismittel: z.literal("augenschein"),
  beschreibung: stringRequiredMaxSchema({ max: 500 }),
});

const urkundeSchema = z.object({
  beweismittel: z.literal("urkunde"),
  beschreibung: stringRequiredMaxSchema({ max: 500 }),
});

const zeugeSchema = z.object({
  beweismittel: z.literal("zeuge"),
  ...personFields,
  ...adresseFields,
});

const sachverstaendigengutachtenSchema = z.object({
  beweismittel: z.literal("sachverstaendigengutachten"),
  beschreibung: stringRequiredMaxSchema({ max: 500 }),
});

const parteivernehmungSchema = z.object({
  beweismittel: z.literal("parteivernehmung"),
  personen: z.array(z.any()), // Will be displayed as checkboxes, but will hold IDs of referenced parties.
});

const beweisSchema = z.discriminatedUnion("beweismittel", [
  augenscheinSchema,
  urkundeSchema,
  zeugeSchema,
  sachverstaendigengutachtenSchema,
  parteivernehmungSchema,
]);

const beweiseArraySchema = z.array(beweisSchema);

export const beweismittelSchema = z.object({
  beweismittel: z.enum(
    beweisSchema.options.map((option) => option.shape.beweismittel.value),
  ),
});

export type BeweisMittel = z.infer<typeof beweismittelSchema>["beweismittel"];

export const absaetzeArraySchema = z
  .array(
    z.object({
      formulierung: stringRequiredMaxSchema({ max: 10000 }),
      beweise: beweiseArraySchema.max(MAX_BEWEISE).optional(),
    }),
  )
  .max(MAX_ABSAETZE);

export type BeweiseArray = z.infer<
  typeof absaetzeArraySchema
>[number]["beweise"];

export type Absatz = z.infer<typeof absaetzeArraySchema>[number];
