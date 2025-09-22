import type { TestCases } from "~/domains/__test__/TestCases";
import type { ProzesskostenhilfeFinanzielleAngabenUserData } from "~/domains/prozesskostenhilfe/formular/finanzielleAngaben/userData";

const commonChildProps = {
  vorname: "a",
  nachname: "b",
  geburtsdatum: "01.01.2020",
} as const;

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
      // @ts-expect-error any entry removes the warning page
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
          ...commonChildProps,
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
          ...commonChildProps,
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
          ...commonChildProps,
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
