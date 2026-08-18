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

const _parentElternteilIndexSchema = z
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

export const alivePersonSchema = z.object({
  ...commonPersonFields,
  ...alivePersonFields,
});

export const deceasedPersonNoKidsSchema = z.object({
  ...commonPersonFields,
  ...deceasedPersonFields,
  hatteKinder: z.literal("no"),
});

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

//#region field helpers
export const nameFieldsHelper = (prefix: string) => ({
  [`${prefix}vorname`]: stringRequiredSchema,
  [`${prefix}nachname`]: stringRequiredSchema,
  [`${prefix}geburtsname`]: stringOptionalSchema,
});

export const geburtsdatumFieldsHelper = (prefix: string) => ({
  [`${prefix}geburtsdatum`]: splitDateSchema,
  [`${prefix}geburtsort`]: stringRequiredSchema,
});

export const parentKindIndexFieldHelper = (prefix: string, depth: number) => {
  if (depth < 2) return {};
  return {
    [`${prefix}parentKindIndex`]: parentKindIndexSchema,
  };
};

export const addressFieldsHelper = (prefix: string) => ({
  [`${prefix}strasse`]: stringRequiredSchema,
  [`${prefix}hausnummer`]: stringRequiredSchema,
  [`${prefix}plz`]: stringRequiredSchema,
  [`${prefix}ort`]: stringRequiredSchema,
  [`${prefix}land`]: stringRequiredSchema,
  [`${prefix}adresszusatz`]: stringOptionalSchema,
});

export const deathDateFieldsHelper = (prefix: string) => ({
  [`${prefix}sterbedatum`]: splitDateSchema,
  [`${prefix}sterbeort`]: stringRequiredSchema,
});

export const isAliveFieldHelper = (prefix: string) => ({
  [`${prefix}isAlive`]: YesNoAnswer,
});

export const hatteKinderFieldHelper = (prefix: string) => ({
  [`${prefix}hatteKinder`]: YesNoAnswer,
});
//#endregion
