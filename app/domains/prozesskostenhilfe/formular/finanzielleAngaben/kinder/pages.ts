import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { kinderSchema } from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenKinderPages = {
  kinderFrage: {
    stepId: "finanzielle-angaben/kinder/kinder-frage",
    pageSchema: {
      hasKinder: YesNoAnswer,
    },
  },
  kinderUebersicht: {
    stepId: "finanzielle-angaben/kinder/uebersicht",
  },
  kinderWarnung: {
    stepId: "finanzielle-angaben/kinder/warnung",
  },
  kinder: {
    stepId: "finanzielle-angaben/kinder/kinder",
    pageSchema: {
      kinder: z.array(kinderSchema),
    },
    arrayPages: {
      name: {
        pageSchema: {
          "kinder#vorname": stringRequiredSchema,
          "kinder#nachname": stringRequiredSchema,
          "kinder#geburtsdatum": kinderSchema.shape.geburtsdatum,
        },
      },
      wohnort: {
        pageSchema: {
          "kinder#wohnortBeiAntragsteller":
            kinderSchema.shape.wohnortBeiAntragsteller,
        },
      },
      "kind-eigene-einnahmen-frage": {
        pageSchema: {
          "kinder#eigeneEinnahmen": YesNoAnswer,
        },
      },
      "kind-eigene-einnahmen": {
        pageSchema: {
          "kinder#einnahmen": buildMoneyValidationSchema(),
        },
      },
      "kind-unterhalt-frage": {
        pageSchema: {
          "kinder#unterhalt": YesNoAnswer,
        },
      },
      "kind-unterhalt": {
        pageSchema: {
          "kinder#unterhaltsSumme": buildMoneyValidationSchema(),
        },
      },
      "kind-unterhalt-ende": {
        pageSchema: {},
      },
    },
  },
} as const satisfies PagesConfig;
