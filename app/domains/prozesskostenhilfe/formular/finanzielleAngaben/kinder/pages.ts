import { type PagesConfig } from "~/domains/pageSchemas";
import {
  kinderArraySchema,
  sharedKinderFields,
} from "~/domains/shared/formular/finanzielleAngaben/userData";
import { buildMoneyValidationSchema } from "~/services/validation/money/buildMoneyValidationSchema";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";

export const pkhFormularFinanzielleAngabenKinderPages = {
  kinderFrage: {
    stepId: "finanzielle-angaben/kinder/kinder-frage",
    pageSchema: { hasKinder: YesNoAnswer },
  },
  kinderUebersicht: {
    stepId: "finanzielle-angaben/kinder/uebersicht",
  },
  kinderWarnung: {
    stepId: "finanzielle-angaben/kinder/warnung",
  },
  kinder: {
    stepId: "finanzielle-angaben/kinder/kinder",
    pageSchema: { kinder: kinderArraySchema },
    arrayPages: {
      name: {
        pageSchema: {
          "kinder#vorname": sharedKinderFields.vorname,
          "kinder#nachname": sharedKinderFields.nachname,
          "kinder#geburtsdatum": sharedKinderFields.geburtsdatum,
        },
      },
      wohnort: {
        pageSchema: {
          "kinder#wohnortBeiAntragsteller":
            sharedKinderFields.wohnortBeiAntragsteller,
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
