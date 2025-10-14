import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";

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
      kinder: [
        {
          vorname: "Maxi",
          nachname: "Mustermensch",
          geburtsdatum: "01.11.2015",
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "no",
        },
      ],
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
          vorname: "Maxi",
          nachname: "Mustermensch",
          geburtsdatum: "01.11.2015",
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
          vorname: "Maxi",
          nachname: "Mustermensch",
          geburtsdatum: "01.11.2015",
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
      kinder: [
        {
          vorname: "Maxi",
          nachname: "Mustermensch",
          geburtsdatum: "01.11.2015",
          wohnortBeiAntragsteller: "no",
          unterhalt: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "/finanzielle-angaben/kinder/kinder/wohnort",
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-frage",
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-ende",
    ],
  ],
] as const satisfies TestCases<ProzesskostenhilfeFinanzielleAngabenUserData>;
