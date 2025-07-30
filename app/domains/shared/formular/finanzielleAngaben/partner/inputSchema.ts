import { type UserDataFromPagesSchema } from "~/domains/pageSchemas";
import { type finanzielleAngabenPartnerPages } from "~/domains/shared/formular/finanzielleAngaben/partner/pages";
import { partnerschaftInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const finanzielleAngabenPartnerInputSchema = {
  partnerschaft: partnerschaftInputSchema,
  zusammenleben: YesNoAnswer,
  unterhalt: YesNoAnswer,
  partnerUnterhaltsSumme: buildMoneyValidationSchema(),
  partnerEinkommen: YesNoAnswer,
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  partnerVorname: stringRequiredSchema,
  partnerNachname: stringRequiredSchema,
};

export type FinanzielleAngabenPartnerUserData = UserDataFromPagesSchema<
  typeof finanzielleAngabenPartnerPages
>;
