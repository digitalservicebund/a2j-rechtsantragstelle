import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenContext } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/context";

export const testCasesPKHFormularFinanzielleAngabenKinder = [
  [
    { hasKinder: "no" },
    [
      "/finanzielle-angaben/kinder/kinder-frage",
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
    ],
  ],
  [
    { hasKinder: "yes" },
    [
      "/finanzielle-angaben/kinder/kinder-frage",
      "/finanzielle-angaben/kinder/uebersicht",
      "/finanzielle-angaben/kinder/warnung",
    ],
  ],
  [
    {
      hasKinder: "yes",
      kinder: [{}],
    },
    [
      "/finanzielle-angaben/kinder/kinder-frage",
      "/finanzielle-angaben/kinder/uebersicht",
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
    ],
  ],
  [
    {
      kinder: [
        {
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
          einnahmen: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/kinder/kinder/name",
      "/finanzielle-angaben/kinder/kinder/wohnort",
      "/finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen-frage",
      "/finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen",
    ],
  ],
  [
    {
      kinder: [
        {
          wohnortBeiAntragsteller: "no",
          unterhalt: "yes",
          unterhaltsSumme: "100",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/kinder/kinder/wohnort",
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-frage",
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt",
    ],
  ],
  [
    {
      kinder: [{ wohnortBeiAntragsteller: "no", unterhalt: "no" }],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/kinder/kinder/wohnort",
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-frage",
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-ende",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenContext>;
