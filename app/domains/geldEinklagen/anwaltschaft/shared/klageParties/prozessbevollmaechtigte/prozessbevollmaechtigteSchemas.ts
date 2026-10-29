import { z } from "zod";
import {
  adresseFields,
  commonFields,
  personFields,
} from "../../klageParties/klagePartySchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { schemaOrEmptyStringOptional } from "~/services/validation/schemaOrEmptyString";
import { emailSchema } from "~/services/validation/email";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import omit from "lodash/omit";
import {
  MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS,
  MAX_PROZESSBEVOLLMAECHTIGTE,
} from "~/domains/geldEinklagen/anwaltschaft/shared/klageParties/prozessbevollmaechtigte/prozessbevollmaechtigteHelpers";

const MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS = 1;

const contactFields = {
  telefonnummer: schemaOrEmptyStringOptional(phoneNumberSchema),
  email: schemaOrEmptyStringOptional(emailSchema),
};

const commonProzessbevollmaechtigteFields = {
  id: commonFields.id,
  name: stringRequiredSchema,
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

export const berufsausuebungsgesellschaftBevollmaechtigtePersonSchema =
  z.object({
    ...personFields,
    namedInSignature: checkedOptional,
    berufsbezeichnung: stringOptionalSchema,
    ...contactFields,
  });

export const berufsausuebungsgesellschaftSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  isProzessbevollmaechtigt: z.literal("off").optional(),
  ["prozessbevollmaechtigte-personen"]: z
    .array(berufsausuebungsgesellschaftBevollmaechtigtePersonSchema)
    .min(MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS)
    .max(MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS),
  type: z.literal("berufsausuebungsgesellschaft"),
});

export type Berufsausuebungsgesellschaft = z.infer<
  typeof berufsausuebungsgesellschaftSchema
>;

export const signaturangabenSchema = z.object({
  ...omit(personFields, "anrede"),
  berufsbezeichnung: stringOptionalSchema,
});

const berufsausuebungsgesellschaftProzessbevollmaechtigtSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  isProzessbevollmaechtigt: z.literal("on"),
  signaturangaben: z
    .array(signaturangabenSchema)
    .min(MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS)
    .max(MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS),
  type: z.literal("berufsausuebungsgesellschaft"),
});

export type BerufsausuebungsgesellschaftProzessbevollmaechtigt = z.infer<
  typeof berufsausuebungsgesellschaftProzessbevollmaechtigtSchema
>;

export const prozessbevollmaechtigteArraySchema = z
  .array(
    z.discriminatedUnion("type", [
      einzelkanzleiSchema,
      z.discriminatedUnion("isProzessbevollmaechtigt", [
        berufsausuebungsgesellschaftSchema,
        berufsausuebungsgesellschaftProzessbevollmaechtigtSchema,
      ]),
    ]),
  )
  .max(MAX_PROZESSBEVOLLMAECHTIGTE);

const beklagteBerufsausuebungsgesellschaftBevollmaechtigtePersonSchema =
  z.object({
    ...personFields,
    berufsbezeichnung: stringOptionalSchema,
  });

const beklagteBerufsausuebungsgesellschaftSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  isProzessbevollmaechtigt: z.literal("off").optional(),
  "prozessbevollmaechtigte-personen": z
    .array(beklagteBerufsausuebungsgesellschaftBevollmaechtigtePersonSchema)
    .min(MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS)
    .max(MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS),
  type: z.literal("berufsausuebungsgesellschaft"),
});

const beklagteBerufsausuebungsgesellschaftProzessbevollmaechtigtSchema =
  z.object({
    ...commonProzessbevollmaechtigteFields,
    isProzessbevollmaechtigt: z.literal("on"),
    type: z.literal("berufsausuebungsgesellschaft"),
  });

export type BeklagteBerufsausuebungsgesellschaft = z.infer<
  typeof beklagteBerufsausuebungsgesellschaftSchema
>;

export type BeklagteBerufsausuebungsgesellschaftProzessbevollmaechtigt =
  z.infer<
    typeof beklagteBerufsausuebungsgesellschaftProzessbevollmaechtigtSchema
  >;

export const beklagteProzessbevollmaechtigteArraySchema = z
  .array(
    z.discriminatedUnion("type", [
      einzelkanzleiSchema,
      z.discriminatedUnion("isProzessbevollmaechtigt", [
        beklagteBerufsausuebungsgesellschaftSchema,
        beklagteBerufsausuebungsgesellschaftProzessbevollmaechtigtSchema,
      ]),
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
