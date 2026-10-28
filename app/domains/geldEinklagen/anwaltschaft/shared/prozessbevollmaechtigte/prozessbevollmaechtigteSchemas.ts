import { z } from "zod";
import {
  adresseFields,
  commonFields,
  personFields,
} from "../klageParties/klagePartySchemas";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import {
  schemaOrEmptyString,
  schemaOrEmptyStringOptional,
} from "~/services/validation/schemaOrEmptyString";
import { emailSchema } from "~/services/validation/email";
import { checkedOptional } from "~/services/validation/checkedCheckbox";

export const MAX_PROZESSBEVOLLMAECHTIGTE = 1;

const commonProzessbevollmaechtigteFields = {
  id: commonFields.id,
  name: stringRequiredSchema,
  geschaeftszeichen: stringOptionalSchema,
  ...adresseFields,
  telefonnummer: schemaOrEmptyStringOptional(phoneNumberSchema),
  email: schemaOrEmptyStringOptional(emailSchema),
};

export const einzelkanzleiSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  ...personFields,
  berufsbezeichnung: stringOptionalSchema,
  type: z.literal("einzelkanzlei"),
});

export const berufsausuebungsgesellschaftSchema = z.object({
  ...commonProzessbevollmaechtigteFields,
  isProzessbevollmaechtigt: schemaOrEmptyString(checkedOptional),
  type: z.literal("berufsausuebungsgesellschaft"),
});

export const prozessbevollmaechtigteArraySchema = z
  .array(
    z.discriminatedUnion("type", [
      einzelkanzleiSchema,
      berufsausuebungsgesellschaftSchema,
    ]),
  )
  .max(MAX_PROZESSBEVOLLMAECHTIGTE);

export type Prozessbevollmaechtigte = z.infer<
  typeof prozessbevollmaechtigteArraySchema
>;
export type ProzessbevollmaechtigteType =
  Prozessbevollmaechtigte[number]["type"];
