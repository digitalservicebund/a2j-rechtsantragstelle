import z from "zod";
import {
  adresseFields,
  personFields,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/klagePartySchemas";
import { stringRequiredMaxSchema } from "~/services/validation/stringRequired";

export const MAX_ABSAETZE = 50;
export const MAX_BEWEISE = 50;
export const parteivernehmungBeweisCheckboxesZodDescription =
  "parteivernehmungBeweisCheckboxes";

export const augenscheinSchema = z.object({
  type: z.literal("augenschein"),
  id: z.uuid().optional(),
  beschreibung: stringRequiredMaxSchema({ max: 500 }),
});

export const urkundeSchema = z.object({
  type: z.literal("urkunde"),
  id: z.uuid().optional(),
  beschreibung: stringRequiredMaxSchema({ max: 500 }),
});

export const zeugeSchema = z.object({
  type: z.literal("zeuge"),
  id: z.uuid().optional(),
  ...personFields,
  ...adresseFields,
});

export const sachverstaendigengutachtenSchema = z.object({
  type: z.literal("sachverstaendigengutachten"),
  id: z.uuid().optional(),
  beschreibung: stringRequiredMaxSchema({ max: 500 }),
});

export const parteivernehmungSchema = z.object({
  type: z.literal("parteivernehmung"),
  id: z.uuid().optional(),
  personen: z
    .record(z.uuid(), z.enum(["on", "off"]))
    .refine(
      (parties) => Object.values(parties).includes("on"),
      "Bitte wählen Sie mindestens eine Person aus",
    )
    .describe(parteivernehmungBeweisCheckboxesZodDescription),
});

const beweisSchema = z.discriminatedUnion("type", [
  augenscheinSchema,
  urkundeSchema,
  zeugeSchema,
  sachverstaendigengutachtenSchema,
  parteivernehmungSchema,
]);

const beweiseArraySchema = z.array(beweisSchema);

export const beweismittelSchema = z.object({
  type: z.enum(beweisSchema.options.map((option) => option.shape.type.value)),
});

export type BeweisType = z.infer<typeof beweismittelSchema>["type"];

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

export type Beweis = NonNullable<BeweiseArray>[number];

export type Absatz = z.infer<typeof absaetzeArraySchema>[number];
