import { z } from "zod";
import { createSplitDateSchema } from "~/services/validation/dateObject";
import { dynamicSelectZodDescription } from "~/services/validation/dynamicSelect";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

const splitDateSchema = createSplitDateSchema({
  earliest: () => addYears(today(), -150),
  latest: () => today(),
});

const parentKindIndexSchema = z
  .string()
  .regex(/^\d+$/, { message: "required" })
  .optional()
  .describe(dynamicSelectZodDescription);

export const parentElternteilIndexSchema = z
  .string()
  .regex(/^(\d+|both)$/, { message: "required" })
  .optional()
  .describe(dynamicSelectZodDescription);

const commonPersonFields = {
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
  geburtsname: stringOptionalSchema,
  geburtsdatum: splitDateSchema,
  geburtsort: stringRequiredSchema,
  isAlive: YesNoAnswer,
};

const deceasedPersonFields = {
  isAlive: z.literal("no"),
  sterbedatum: splitDateSchema,
  sterbeort: stringRequiredSchema,
};

const alivePersonFields = {
  isAlive: z.literal("yes"),
  strasse: stringRequiredSchema,
  hausnummer: stringRequiredSchema,
  plz: stringRequiredSchema,
  ort: stringRequiredSchema,
  land: stringRequiredSchema,
  adresszusatz: stringOptionalSchema,
};

const alivePersonSchema = z.object({
  ...commonPersonFields,
  ...alivePersonFields,
});

const deceasedPersonNoKidsSchema = z.object({
  ...commonPersonFields,
  ...deceasedPersonFields,
  hatteKinder: z.literal("no"),
});

export type AlivePerson = z.infer<typeof alivePersonSchema>;
export type DeceasedPersonNoKids = z.infer<typeof deceasedPersonNoKidsSchema>;

export function personUnion<Child extends z.ZodTypeAny>(childSchema: Child) {
  return z.union([
    alivePersonSchema,
    deceasedPersonNoKidsSchema,
    z.object({
      ...commonPersonFields,
      ...deceasedPersonFields,
      hatteKinder: z.literal("yes"),
      kinder: z.array(childSchema).optional(),
    }),
  ]);
}

//#region Explicit Helpers Avoiding Record<string, never>
export const nameFieldsHelper = <P extends string>(prefix: P) => ({
  [`${prefix}vorname` as const]: stringRequiredSchema,
  [`${prefix}nachname` as const]: stringRequiredSchema,
  [`${prefix}geburtsname` as const]: stringOptionalSchema,
});

export const geburtsdatumFieldsHelper = <P extends string>(prefix: P) => ({
  [`${prefix}geburtsdatum` as const]: splitDateSchema,
  [`${prefix}geburtsort` as const]: stringRequiredSchema,
});

// FIX: Avoid returning empty object {} which resolves to Record<string, never>
export const parentKindIndexFieldHelper = <P extends string>(
  prefix: P,
  depth: number,
) => {
  if (depth < 2) return {} as Record<never, never>;
  return {
    [`${prefix}parentKindIndex` as const]: parentKindIndexSchema,
  };
};

export const addressFieldsHelper = <P extends string>(prefix: P) => ({
  [`${prefix}strasse` as const]: stringRequiredSchema,
  [`${prefix}hausnummer` as const]: stringRequiredSchema,
  [`${prefix}plz` as const]: stringRequiredSchema,
  [`${prefix}ort` as const]: stringRequiredSchema,
  [`${prefix}land` as const]: stringRequiredSchema,
  [`${prefix}adresszusatz` as const]: stringOptionalSchema,
});

export const deathDateFieldsHelper = <P extends string>(prefix: P) => ({
  [`${prefix}sterbedatum` as const]: splitDateSchema,
  [`${prefix}sterbeort` as const]: stringRequiredSchema,
});

export const isAliveFieldHelper = <P extends string>(prefix: P) => ({
  [`${prefix}isAlive` as const]: YesNoAnswer,
});

export const hatteKinderFieldHelper = <P extends string>(prefix: P) => ({
  [`${prefix}hatteKinder` as const]: YesNoAnswer,
});
//#endregion
