import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import {
  customRequiredErrorMessage,
  YesNoAnswer,
} from "~/services/validation/YesNoAnswer";

export const berhAntragFinanzielleAngabenEinkommenPages = {
  einkommenStart: {
    stepId: "finanzielle-angaben/einkommen/start",
  },
  staatlicheLeistungen: {
    stepId: "finanzielle-angaben/einkommen/staatliche-leistungen",
    pageSchema: {
      staatlicheLeistungen: z.enum(
        ["grundsicherung", "asylbewerberleistungen", "buergergeld", "keine"],
        customRequiredErrorMessage,
      ),
    },
  },
  erwerbstaetig: {
    stepId: "finanzielle-angaben/einkommen/erwerbstaetig",
    pageSchema: {
      erwerbstaetig: YesNoAnswer,
    },
  },
  berufart: {
    stepId: "finanzielle-angaben/einkommen/art",
    pageSchema: {
      berufart: z.object({
        selbststaendig: checkedOptional,
        festangestellt: checkedOptional,
      }),
    },
  },
  situation: {
    stepId: "finanzielle-angaben/einkommen/situation",
    pageSchema: {
      berufsituation: z.enum(
        ["pupil", "student", "retiree", "no"],
        customRequiredErrorMessage,
      ),
    },
  },
  weiteresEinkommen: {
    stepId: "finanzielle-angaben/einkommen/weiteres-einkommen",
    pageSchema: {
      weitereseinkommen: z.object({
        unterhaltszahlungen: checkedOptional,
        arbeitlosengeld: checkedOptional,
        wohngeld: checkedOptional,
        kindergeld: checkedOptional,
        bafoeg: checkedOptional,
        krankengeld: checkedOptional,
        rente: checkedOptional,
        elterngeld: checkedOptional,
        insolvenzgeld: checkedOptional,
        ueberbrueckungsgeld: checkedOptional,
        others: checkedOptional,
      }),
    },
  },
  einkommen: {
    stepId: "finanzielle-angaben/einkommen/einkommen",
    pageSchema: {
      einkommen: buildMoneyValidationSchema(),
    },
  },
} as const satisfies PagesConfig;
