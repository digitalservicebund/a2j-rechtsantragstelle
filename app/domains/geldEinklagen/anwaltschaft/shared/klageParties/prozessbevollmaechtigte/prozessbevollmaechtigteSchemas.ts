import { z } from "zod";
import {
  adresseFields,
  commonFields,
  personFields,
} from "../../klageParties/klagePartySchemas";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";
import { emailSchema } from "~/services/validation/email";
import omit from "lodash/omit";
import {
  MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS,
  MAX_PROZESSBEVOLLMAECHTIGTE,
  MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_VERANTWORTENDE_PERSONEN,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";

const contactFields = {
  telefonnummer: schemaOrEmptyStringOptional(phoneNumberSchema),
  email: schemaOrEmptyStringOptional(emailSchema),
};

const commonProzessbevollmaechtigteFields = {
  id: commonFields.id,
  name: stringOptionalSchema,
  geschaeftszeichen: stringOptionalSchema,
  ...adresseFields,
  ...contactFields,
};

export const einzelkanzleiSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  ...personFields,
  berufsbezeichnung: stringOptionalSchema,
  type: z.literal("einzelkanzlei"),
});

export const verantwortendePersonSchema = z.object({
  ...omit(personFields, "anrede"),
  berufsbezeichnung: stringOptionalSchema,
});

export const berufsausuebungsgesellschaftSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  ["verantwortende-personen"]: z
    .array(verantwortendePersonSchema)
    .min(MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_VERANTWORTENDE_PERSONEN)
    .max(MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS),
  type: z.literal("berufsausuebungsgesellschaft"),
});

export type Berufsausuebungsgesellschaft = z.infer<
  typeof berufsausuebungsgesellschaftSchema
>;

export const prozessbevollmaechtigteArraySchema = z
  .array(
    z.discriminatedUnion("type", [
      einzelkanzleiSchema,
      berufsausuebungsgesellschaftSchema,
    ]),
  )
  .max(MAX_PROZESSBEVOLLMAECHTIGTE);

export const beklagteBerufsausuebungsgesellschaftSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  type: z.literal("berufsausuebungsgesellschaft"),
});

export type BeklagteBerufsausuebungsgesellschaft = z.infer<
  typeof beklagteBerufsausuebungsgesellschaftSchema
>;

export const beklagteProzessbevollmaechtigteArraySchema = z
  .array(
    z.discriminatedUnion("type", [
      einzelkanzleiSchema,
      beklagteBerufsausuebungsgesellschaftSchema,
    ]),
  )
  .max(MAX_PROZESSBEVOLLMAECHTIGTE);

export type KlagendeProzessbevollmaechtigte = z.infer<
  typeof prozessbevollmaechtigteArraySchema
>;
export type BeklagteProzessbevollmaechtigte = z.infer<
  typeof beklagteProzessbevollmaechtigteArraySchema
>;

export type Prozessbevollmaechtigte =
  | KlagendeProzessbevollmaechtigte[number]
  | BeklagteProzessbevollmaechtigte[number];

export type ProzessbevollmaechtigteType =
  KlagendeProzessbevollmaechtigte[number]["type"];
