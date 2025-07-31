import { type PagesConfig } from "~/domains/pageSchemas";
import { partnerschaftInputSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const finanzielleAngabenPartnerPages = {
  partnerschaft: {
    stepId: "finanzielle-angaben/partner/partnerschaft",
    pageSchema: {
      partnerschaft: partnerschaftInputSchema,
    },
  },
  partnerZusammenleben: {
    stepId: "finanzielle-angaben/partner/zusammenleben",
    pageSchema: {
      zusammenleben: YesNoAnswer,
    },
  },
  partnerUnterhalt: {
    stepId: "finanzielle-angaben/partner/unterhalt",
    pageSchema: {
      unterhalt: YesNoAnswer,
    },
  },
  partnerKeineRolle: {
    stepId: "finanzielle-angaben/partner/keine-rolle",
  },
  partnerUnterhaltsSumme: {
    stepId: "finanzielle-angaben/partner/unterhalts-summe",
    pageSchema: {
      partnerUnterhaltsSumme: buildMoneyValidationSchema(),
    },
  },
  partnerEinkommen: {
    stepId: "finanzielle-angaben/partner/partner-einkommen",
    pageSchema: {
      partnerEinkommen: YesNoAnswer,
    },
  },
  partnerEinkommenSumme: {
    stepId: "finanzielle-angaben/partner/partner-einkommen-summe",
    pageSchema: {
      partnerEinkommenSumme: buildMoneyValidationSchema(),
    },
  },
  partnerName: {
    stepId: "finanzielle-angaben/partner/partner-name",
    pageSchema: {
      partnerVorname: stringRequiredSchema,
      partnerNachname: stringRequiredSchema,
    },
  },
} as const satisfies PagesConfig;
