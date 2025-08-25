import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const berhAntragFinanzielleAngabenPartnerPages = {
  partnerschaft: {
    stepId: "finanzielle-angaben/partner/partnerschaft",
    pageSchema: {
      partnerschaft: z.enum(["yes", "no", "separated", "widowed"]),
    },
  },
  zusammenleben: {
    stepId: "finanzielle-angaben/partner/zusammenleben",
    pageSchema: {
      zusammenleben: YesNoAnswer,
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
  unterhalt: {
    stepId: "finanzielle-angaben/partner/unterhalt",
    pageSchema: {
      unterhalt: YesNoAnswer,
    },
  },
  keineRolle: {
    stepId: "finanzielle-angaben/partner/keine-rolle",
  },
  partnerUnterhaltsSumme: {
    stepId: "finanzielle-angaben/partner/unterhalts-summe",
    pageSchema: {
      partnerUnterhaltsSumme: buildMoneyValidationSchema(),
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
