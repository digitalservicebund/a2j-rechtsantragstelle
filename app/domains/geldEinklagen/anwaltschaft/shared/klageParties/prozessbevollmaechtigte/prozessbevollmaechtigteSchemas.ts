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

export const MAX_PROZESSBEVOLLMAECHTIGTE = 1;
const MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS = 1;
export const MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS = 5;

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

export const signaturangabenArraySchema = z
  .array(
    z.object({
      ...omit(personFields, "anrede"),
      berufsbezeichnung: stringOptionalSchema,
    }),
  )
  .min(MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS)
  .max(MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS);

const berufsausuebungsgesellschaftProzessbevollmaechtigtSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  isProzessbevollmaechtigt: z.literal("on"),
  signaturangaben: signaturangabenArraySchema,
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

const beklagteBerufsausuebungsgesellschaftProzessbevollmaechtigtSchema =
  berufsausuebungsgesellschaftProzessbevollmaechtigtSchema
    .omit({
      signaturangaben: true,
    })
    .extend({
      "prozessbevollmaechtigte-personen": z
        .array(
          berufsausuebungsgesellschaftBevollmaechtigtePersonSchema.omit({
            namedInSignature: true,
            telefonnummer: true,
            email: true,
          }),
        )
        .min(MIN_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS)
        .max(MAX_BERUFSAUSUEBUNGSGESELLSCHAFT_ADDITIONAL_PERSONS),
    });

export type BeklagteBerufsausuebungsgesellschaftProzessbevollmaechtigt =
  z.infer<
    typeof beklagteBerufsausuebungsgesellschaftProzessbevollmaechtigtSchema
  >;

export const beklagteProzessbevollmaechtigteArraySchema = z
  .array(
    z.discriminatedUnion("type", [
      einzelkanzleiSchema,
      z.discriminatedUnion("isProzessbevollmaechtigt", [
        berufsausuebungsgesellschaftSchema,
        beklagteBerufsausuebungsgesellschaftProzessbevollmaechtigtSchema,
      ]),
    ]),
  )
  .max(MAX_PROZESSBEVOLLMAECHTIGTE);

export type Prozessbevollmaechtigte = z.infer<
  typeof prozessbevollmaechtigteArraySchema
>;
export type BeklagteProzessbevollmaechtigte = z.infer<
  typeof beklagteProzessbevollmaechtigteArraySchema
>;
export type ProzessbevollmaechtigteType =
  Prozessbevollmaechtigte[number]["type"];
