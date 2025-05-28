import { z } from "zod";
import { familyRelationshipInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { vornameNachnameSchema } from "~/domains/shared/formular/persoenlicheDaten/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const prozesskostenhilfeAntragstellendePersonInputSchema = {
  empfaenger: z.enum(["ich", "anderePerson"], customRequiredErrorMessage),
  unterhaltsanspruch: z.enum(
    ["keine", "unterhalt", "anspruchNoUnterhalt"],
    customRequiredErrorMessage,
  ),
  unterhaltsSumme: buildMoneyValidationSchema(),
  livesPrimarilyFromUnterhalt: YesNoAnswer,
  unterhaltspflichtigePerson: z
    .object({
      beziehung: familyRelationshipInputSchema,
      ...vornameNachnameSchema,
    })
    .optional(),
  couldLiveFromUnterhalt: YesNoAnswer,
  personWhoCouldPayUnterhaltBeziehung: familyRelationshipInputSchema,
  whyNoUnterhalt: stringRequiredSchema,
};

const _partialSchema = z
  .object(prozesskostenhilfeAntragstellendePersonInputSchema)
  .partial();
export type ProzesskostenhilfeAntragstellendePersonUserData = z.infer<
  typeof _partialSchema
>;
