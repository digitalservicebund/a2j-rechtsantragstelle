import _ from "lodash";
import { z } from "zod";
import {
  namePrivatPerson,
  persoenlicheDaten as sharedPersoenlicheDaten,
} from "~/flows/shared/persoenlicheDaten/context";
import {
  checkedOptional,
  checkedRequired,
} from "~/services/validation/checkedCheckbox";
import { emailSchema } from "~/services/validation/email";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringOptionalSchema } from "~/services/validation/stringOptional";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

const persoenlicheDaten = {
  ..._.omit(sharedPersoenlicheDaten, ["geburtsdatum"]),
  bevollmaechtigtePerson: z.enum(
    ["lawyer", "yes", "no"],
    customRequiredErrorMessage,
  ),
};

export const context = {
  anzahl: z.enum(["1", "2", "3"], customRequiredErrorMessage),
  ...persoenlicheDaten,
  volljaehrig: YesNoAnswer,
  gesetzlicheVertretung: YesNoAnswer,
  gegenseite: z
    .object({
      typ: z.enum(["privatperson", "unternehmen"], customRequiredErrorMessage),
      privatperson: z.object(persoenlicheDaten).partial(),
      unternehmen: z
        .object({
          name: stringRequiredSchema,
          inhaber: stringRequiredSchema,
          adresszusatz: stringOptionalSchema,
          ..._.omit(persoenlicheDaten, [
            "anrede",
            "vorname",
            "nachname",
            "title",
          ]),
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
              ...persoenlicheDaten,
              email: z.union([emailSchema, z.literal("")]),
            })
            .partial(),
          zeuge: z.object(namePrivatPerson).partial(),
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

const _contextObject = z.object(context).partial();
export type GeldEinklagenFormularContext = z.infer<typeof _contextObject>;
