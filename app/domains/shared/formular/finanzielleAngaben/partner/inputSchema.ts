import { partnerschaftSchema } from "~/domains/shared/formular/finanzielleAngaben/context";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const finanzielleAngabenPartnerInputSchema = {
  partnerschaft: partnerschaftSchema,
  zusammenleben: YesNoAnswer,
  unterhalt: YesNoAnswer,
  partnerUnterhaltsSumme: buildMoneyValidationSchema(),
  partnerEinkommen: YesNoAnswer,
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  partnerVorname: stringRequiredSchema,
  partnerNachname: stringRequiredSchema,
};
