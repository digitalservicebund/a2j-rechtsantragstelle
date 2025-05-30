import omit from "lodash/omit";
import { z } from "zod";
import {
  adresseSchema,
  namePrivatPerson,
  persoenlicheDaten as sharedPersoenlicheDaten,
  telefonnummer,
} from "~/domains/shared/formular/persoenlicheDaten/userData";
import {
  checkedOptional,
  checkedRequired,
} from "~/services/validation/checkedCheckbox";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { schemaOrEmptyString } from "~/services/validation/schemaOrEmptyString";
import { phoneNumberSchema } from "~/services/validation/phoneNumber";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const persoenlicheDatenInputSchema = {
  ...sharedPersoenlicheDaten,
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
  gegenseite: z
    .object({
      typ: z.enum(["privatperson", "unternehmen"], customRequiredErrorMessage),
      privatperson: z.object(persoenlicheDatenInputSchema).partial(),
      unternehmen: z
        .object({
          name: stringRequiredSchema,
          inhaber: stringRequiredSchema,
          adresszusatz: stringOptionalSchema,
          ...adresseSchema,
          bevollmaechtigtePerson: z.enum(
            ["lawyer", "yes", "no"],
            customRequiredErrorMessage,
          ),
          telefonnummer: schemaOrEmptyString(phoneNumberSchema),
        })
        .partial(),
    })
    .partial(),
  forderung: z
    .object({
      nebenforderungen: YesNoAnswer,
      forderung1: z
        .object({
          title: stringRequiredSchema,
          betrag: buildMoneyValidationSchema(),
          beschreibung: stringRequiredSchema,
          person: z
            .object({
              ...adresseSchema,
              telefonnummer,
            })
            .partial(),
          zeuge: z.object(omit(namePrivatPerson, "anrede")).partial(),
        })
        .partial(),
      forderung2: z
        .object({
          title: stringRequiredSchema,
          betrag: buildMoneyValidationSchema(),
          beschreibung: stringRequiredSchema,
        })
        .partial(),
    })
    .partial(),
  versaeumnisurteil: YesNoAnswer,
  anmerkung: stringOptionalSchema,
  aenderungMitteilung: checkedRequired,
  zahlungOptional: checkedOptional,
} as const;

const _partialSchema = z.object(geldEinklagenInputSchema).partial();
export type GeldEinklagenFormularUserData = z.infer<typeof _partialSchema>;
