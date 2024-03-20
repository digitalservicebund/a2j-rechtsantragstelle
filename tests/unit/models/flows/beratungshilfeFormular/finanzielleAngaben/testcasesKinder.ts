import { createMachine } from "xstate";
import { beratungshilfeFormular } from "~/models/flows/beratungshilfeFormular";
import type { TestCases } from "../../TestCases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const machine: FlowStateMachine = createMachine(beratungshilfeFormular.config, {
  guards: beratungshilfeFormular.guards,
});

const BIRTHDAY_KID_MOCK = "10.10.2020";

const FINANZIELLE_ANGABEN = "finanzielleAngaben";

const cases = [
  [
    { hasKinder: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder-frage`,
      `${FINANZIELLE_ANGABEN}/kinder/uebersicht`,
    ],
  ],
  [
    { hasKinder: "no" },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder-frage`,
      `${FINANZIELLE_ANGABEN}/besitz/eigentum-info`,
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: BIRTHDAY_KID_MOCK,
          eigeneEinnahmen: "yes",
          einnahmen: "",
          unterhalt: "no",
          unterhaltsSumme: "0",
          wohnortBeiAntragsteller: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder/wohnort`,
      `${FINANZIELLE_ANGABEN}/kinder/kinder/kind-eigene-einnahmen-frage`,
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: BIRTHDAY_KID_MOCK,
          eigeneEinnahmen: "yes",
          einnahmen: "",
          unterhalt: "no",
          unterhaltsSumme: "0",
          wohnortBeiAntragsteller: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder/kind-eigene-einnahmen-frage`,
      `${FINANZIELLE_ANGABEN}/kinder/kinder/kind-eigene-einnahmen`,
    ],
  ],
  [
    { hasKinder: "yes" },
    [
      `${FINANZIELLE_ANGABEN}/kinder/uebersicht`,
      `${FINANZIELLE_ANGABEN}/besitz/eigentum-info`,
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: BIRTHDAY_KID_MOCK,
          eigeneEinnahmen: "yes",
          einnahmen: "",
          unterhalt: "no",
          unterhaltsSumme: "0",
          wohnortBeiAntragsteller: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder/wohnort`,
      `${FINANZIELLE_ANGABEN}/kinder/kinder/kind-unterhalt-frage`,
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: BIRTHDAY_KID_MOCK,
          eigeneEinnahmen: "yes",
          einnahmen: "",
          unterhalt: "yes",
          unterhaltsSumme: "0",
          wohnortBeiAntragsteller: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      `${FINANZIELLE_ANGABEN}/kinder/kinder/kind-unterhalt-frage`,
      `${FINANZIELLE_ANGABEN}/kinder/kinder/kind-unterhalt`,
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenKinder = {
  machine,
  cases,
};
