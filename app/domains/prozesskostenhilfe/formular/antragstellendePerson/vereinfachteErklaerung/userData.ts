import { z } from "zod";
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
};

const _partialSchema = z
  .object(prozesskostenhilfeVereinfachteErklaerungInputSchema)
  .partial();

export type ProzesskostenhilfeVereinfachteErklaerungUserData = z.infer<
  typeof _partialSchema
>;
