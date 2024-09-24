import { z } from "zod";
import { partnerschaftSchema } from "~/flows/shared/finanzielleAngaben/context";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const finanzielleAngabenPartnerContext = {
  partnerschaft: partnerschaftSchema,
  zusammenleben: YesNoAnswer,
  unterhalt: YesNoAnswer,
  unterhaltsSumme: buildMoneyValidationSchema(),
  partnerEinkommen: YesNoAnswer,
  partnerEinkommenSumme: buildMoneyValidationSchema(),
  partnerVorname: stringRequiredSchema,
  partnerNachname: stringRequiredSchema,
};

const _contextObject = z.object(finanzielleAngabenPartnerContext).partial();
export type FinanzielleAngabenPartnerContext = z.infer<typeof _contextObject>;
