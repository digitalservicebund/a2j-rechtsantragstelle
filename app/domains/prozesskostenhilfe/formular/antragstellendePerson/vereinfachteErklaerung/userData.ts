import { z } from "zod";
import {
  geburtsdatum,
  vornameNachnameSchema,
} from "~/domains/shared/formular/persoenlicheDaten/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeVereinfachteErklaerungInputSchema = {
  child: z.object({ ...vornameNachnameSchema, geburtsdatum }),
  livesTogether: YesNoAnswer,
  unterhaltsSumme: buildMoneyValidationSchema(),
  minderjaehrig: YesNoAnswer,
};

const _partialSchema = z
  .object(prozesskostenhilfeVereinfachteErklaerungInputSchema)
  .partial();

export type ProzesskostenhilfeVereinfachteErklaerungUserData = z.infer<
  typeof _partialSchema
>;
