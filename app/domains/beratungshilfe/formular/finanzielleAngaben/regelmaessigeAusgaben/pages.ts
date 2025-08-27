import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { checkedOptional } from "~/services/validation/checkedCheckbox";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { today } from "~/util/date";

export const berhAntragFinanzielleAngabenRegelmassigeAusgabenPages = {
  ausgaben: {
    stepId: "finanzielle-angaben/ausgaben",
  },
  ausgabenFrage: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben-frage",
    pageSchema: {
      hasAusgaben: YesNoAnswer,
    },
  },
  ausgabenSituation: {
    stepId: "finanzielle-angaben/ausgaben/situation",
    pageSchema: {
      ausgabensituation: z.object({
        pregnancy: checkedOptional,
        singleParent: checkedOptional,
        disability: checkedOptional,
        medicalReasons: checkedOptional,
      }),
    },
  },
  ausgabenUebersicht: {
    stepId: "finanzielle-angaben/ausgaben/uebersicht",
  },
  ausgabenAusgaben: {
    stepId: "finanzielle-angaben/ausgaben/ausgaben",
    pageSchema: {
      ausgaben: z.array(
        z
          .object({
            art: stringRequiredSchema,
            zahlungsempfaenger: stringRequiredSchema,
            beitrag: buildMoneyValidationSchema(),
            hasZahlungsfrist: YesNoAnswer,
            zahlungsfrist: createDateSchema({
              earliest: () => today(),
            }),
          })
          .partial(),
      ),
    },
    arrayPages: {
      art: {
        pageSchema: {
          "ausgaben#art": stringRequiredSchema,
          "ausgaben#zahlungsempfaenger": stringRequiredSchema,
        },
      },
      zahlungsinformation: {
        pageSchema: {
          "ausgaben#beitrag": buildMoneyValidationSchema(),
        },
      },
      laufzeit: {
        pageSchema: {
          "ausgaben#hasZahlungsfrist": YesNoAnswer,
        },
      },
      zahlungsfrist: {
        pageSchema: {
          "ausgaben#zahlungsfrist": createDateSchema({
            earliest: () => today(),
          }),
        },
      },
    },
  },
  ausgabenWarnung: {
    stepId: "finanzielle-angaben/ausgaben/warnung",
  },
} as const satisfies PagesConfig;
