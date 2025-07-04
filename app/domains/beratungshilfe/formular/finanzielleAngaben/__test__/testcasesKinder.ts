import type { TestCases } from "~/domains/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngabenUserData } from "~/domains/beratungshilfe/formular/finanzielleAngaben/userData";

const finanzielleAngabenKinderKinderName =
  "/finanzielle-angaben/kinder/kinder/name";
const finanzielleAngabenKinderKinderWohnort =
  "/finanzielle-angaben/kinder/kinder/wohnort";
const finanzielleAngabenKinderKinderKindUnterhaltFrage =
  "/finanzielle-angaben/kinder/kinder/kind-unterhalt-frage";

const defaultInputKinder = {
  wohnortBeiAntragsteller: "yes",
  vorname: "",
  nachname: "",
  geburtsdatum: "",
  eigeneEinnahmen: "yes",
  einnahmen: "",
  unterhalt: "yes",
  unterhaltsSumme: "",
} as const;

export const testCasesBeratungshilfeFormularFinanzielleAngabenKinder = [
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
          vorname: "a",
          nachname: "b",
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "no",
          unterhalt: "no",
          geburtsdatum: "01.01.1990",
          unterhaltsSumme: "0",
          einnahmen: "0",
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
    { hasKinder: "no" },
    [
      "/finanzielle-angaben/kinder/kinder-frage",
      "/finanzielle-angaben/andere-unterhaltszahlungen/frage",
    ],
  ],
  [
    {},
    [finanzielleAngabenKinderKinderName, finanzielleAngabenKinderKinderWohnort],
  ],
  [
    {
      kinder: [
        {
          ...defaultInputKinder,
          wohnortBeiAntragsteller: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      "/finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen-frage",
    ],
  ],
  [
    {
      kinder: [
        {
          ...defaultInputKinder,
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      "/finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen-frage",
      "/finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen",
    ],
  ],
  [
    {
      kinder: [
        {
          ...defaultInputKinder,
          wohnortBeiAntragsteller: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      finanzielleAngabenKinderKinderKindUnterhaltFrage,
    ],
  ],
  [
    {
      kinder: [
        {
          ...defaultInputKinder,
          wohnortBeiAntragsteller: "no",
          unterhalt: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      finanzielleAngabenKinderKinderKindUnterhaltFrage,
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt-ende",
    ],
  ],
  [
    {
      kinder: [
        {
          ...defaultInputKinder,
          wohnortBeiAntragsteller: "no",
          unterhalt: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      finanzielleAngabenKinderKinderKindUnterhaltFrage,
      "/finanzielle-angaben/kinder/kinder/kind-unterhalt",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngabenUserData>;
