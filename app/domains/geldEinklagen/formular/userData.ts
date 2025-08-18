import omit from "lodash/omit";
import { z } from "zod";
import {
  checkedOptional,
  checkedRequired,
} from "~/services/validation/checkedCheckbox";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { postcodeSchema } from "~/services/validation/postcode";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const adresseSchema = {
  strasseHausnummer: stringRequiredSchema,
  plz: stringRequiredSchema.pipe(postcodeSchema),
  ort: stringRequiredSchema,
};

export const namePrivatPerson = {
  title: z.enum(["", "dr"], customRequiredErrorMessage),
  vorname: stringRequiredSchema,
  nachname: stringRequiredSchema,
};

export const telefonnummer = schemaOrEmptyString(phoneNumberSchema);

export const persoenlicheDaten = {
  ...namePrivatPerson,
  ...adresseSchema,
  telefonnummer,
};

const persoenlicheDatenInputSchema = {
  ...persoenlicheDaten,
  bevollmaechtigtePerson: z.enum(
    ["lawyer", "yes", "no"],
    customRequiredErrorMessage,
  ),
};

export const geldEinklagenInputSchema = {
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  ...persoenlicheDatenInputSchema,
  volljaehrig: YesNoAnswer,
  gesetzlicheVertretung: YesNoAnswer,
  gegenseite: z.object({
    typ: z.enum(["privatperson", "unternehmen"], customRequiredErrorMessage),
    privatperson: z.object(persoenlicheDatenInputSchema),
    unternehmen: z.object({
      name: stringRequiredSchema,
      inhaber: stringRequiredSchema,
      adresszusatz: stringOptionalSchema,
      ...adresseSchema,
      bevollmaechtigtePerson: z.enum(
        ["lawyer", "yes", "no"],
        customRequiredErrorMessage,
      ),
      telefonnummer: schemaOrEmptyString(phoneNumberSchema),
    }),
  }),
  forderung: z.object({
    nebenforderungen: YesNoAnswer,
    forderung1: z.object({
      title: stringRequiredSchema,
      betrag: buildMoneyValidationSchema(),
      beschreibung: stringRequiredSchema,
      person: z.object({
        ...adresseSchema,
        telefonnummer,
      }),
      zeuge: z.object(omit(namePrivatPerson, "anrede")),
    }),
    forderung2: z.object({
      title: stringRequiredSchema,
      betrag: buildMoneyValidationSchema(),
      beschreibung: stringRequiredSchema,
    }),
  }),
  versaeumnisurteil: YesNoAnswer,
  anmerkung: stringOptionalSchema,
  aenderungMitteilung: checkedRequired,
  zahlungOptional: checkedOptional,
} as const;

const _partialSchema = z.object(geldEinklagenInputSchema).partial();
export type GeldEinklagenFormularUserData = z.infer<typeof _partialSchema>;
