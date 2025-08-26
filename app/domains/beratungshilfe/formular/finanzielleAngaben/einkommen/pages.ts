import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import {
  checkedOptional,
  exclusiveCheckboxesSchema,
} from "~/services/validation/checkedCheckbox";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const berhAntragFinanzielleAngabenEinkommenPages = {
  einkommenStart: {
    stepId: "finanzielle-angaben/einkommen/start",
  },
  staatlicheLeistungen: {
    stepId: "finanzielle-angaben/einkommen/staatliche-leistungen",
    pageSchema: {
      staatlicheLeistungen: z.enum([
        "grundsicherung",
        "asylbewerberleistungen",
        "buergergeld",
        "keine",
      ]),
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
      berufsituation: z.enum(["pupil", "student", "retiree", "no"]),
    },
  },
  weiteresEinkommen: {
    stepId: "finanzielle-angaben/einkommen/weiteres-einkommen",
    pageSchema: {
      weitereseinkommen: exclusiveCheckboxesSchema([
        "unterhaltszahlungen",
        "arbeitlosengeld",
        "wohngeld",
        "kindergeld",
        "bafoeg",
        "krankengeld",
        "rente",
        "elterngeld",
        "insolvenzgeld",
        "ueberbrueckungsgeld",
        "others",
        "none",
      ]),
    },
  },
  einkommen: {
    stepId: "finanzielle-angaben/einkommen/einkommen",
    pageSchema: {
      einkommen: buildMoneyValidationSchema(),
    },
  },
} as const satisfies PagesConfig;
