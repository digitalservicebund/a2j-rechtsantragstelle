import { z } from "zod";
import { type PagesConfig } from "~/domains/pageSchemas";
import { createDateSchema } from "~/services/validation/date";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { stringRequiredSchema } from "~/services/validation/stringRequired";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addYears, today } from "~/util/date";

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
      kinder: z.array(
        z
          .object({
            vorname: stringRequiredSchema,
            nachname: stringRequiredSchema,
            geburtsdatum: createDateSchema({
              earliest: () => addYears(today(), -24),
              latest: () => today(),
            }),
            wohnortBeiAntragsteller: z.enum(["yes", "no", "partially"]),
            eigeneEinnahmen: YesNoAnswer,
            einnahmen: buildMoneyValidationSchema(),
            unterhalt: YesNoAnswer,
            unterhaltsSumme: buildMoneyValidationSchema(),
          })
          .partial(),
      ),
    },
    arrayPages: {
      name: {
        pageSchema: {
          "kinder#vorname": stringRequiredSchema,
          "kinder#nachname": stringRequiredSchema,
          "kinder#geburtsdatum": createDateSchema({
            earliest: () => addYears(today(), -24),
            latest: () => today(),
          }),
        },
      },
      wohnort: {
        pageSchema: {
          "kinder#wohnortBeiAntragsteller": z.enum(["yes", "no", "partially"]),
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
      "kind-unterhalt-ende": {},
    },
  },
} as const satisfies PagesConfig;
