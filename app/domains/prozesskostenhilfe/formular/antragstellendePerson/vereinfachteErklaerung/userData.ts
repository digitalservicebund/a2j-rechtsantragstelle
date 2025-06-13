import { z } from "zod";
import { financialEntryInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import {
  geburtsdatum,
  vornameNachnameSchema,
} from "~/domains/shared/formular/persoenlicheDaten/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeVereinfachteErklaerungInputSchema = {
  child: z.object({ ...vornameNachnameSchema, geburtsdatum }).partial(),
  livesTogether: YesNoAnswer,
  unterhaltsSumme: buildMoneyValidationSchema(),
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
};

const _partialSchema = z
  .object(prozesskostenhilfeVereinfachteErklaerungInputSchema)
  .partial();

export type ProzesskostenhilfeVereinfachteErklaerungUserData = z.infer<
  typeof _partialSchema
>;
