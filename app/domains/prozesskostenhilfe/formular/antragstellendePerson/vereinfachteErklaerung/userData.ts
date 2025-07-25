import { z } from "zod";
import {
  financialEntryInputSchema,
  kinderSchema,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { geburtsdatum } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeVereinfachteErklaerungInputSchema = {
  child: kinderSchema.extend({
    geburtsdatum,
  }),
  livesTogether: YesNoAnswer,
  minderjaehrig: YesNoAnswer,
  unterhaltsOrAbstammungssachen: YesNoAnswer,
  rechtlichesThema: z.enum(
    ["unterhalt", "vollstreckung", "abstammung", "other"],
    customRequiredErrorMessage,
  ),
  hasEinnahmen: YesNoAnswer,
  einnahmen: z.array(financialEntryInputSchema),
  hohesEinkommen: YesNoAnswer,
  hasVermoegen: YesNoAnswer,
  vermoegenUnder10000: YesNoAnswer,
  vermoegen: z.array(
    z
      .object({
        beschreibung: stringRequiredSchema,
        wert: buildMoneyValidationSchema(),
      })
      .partial(),
  ),
};

const _partialSchema = z
  .object(prozesskostenhilfeVereinfachteErklaerungInputSchema)
  .partial();

export type ProzesskostenhilfeVereinfachteErklaerungUserData = z.infer<
  typeof _partialSchema
>;
