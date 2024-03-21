import { machine } from "./testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { hasKinder: "yes" },
    [
      "finanzielleAngaben/kinder/kinder-frage",
      "finanzielleAngaben/kinder/uebersicht",
    ],
  ],
  [
    { hasKinder: "no" },
    [
      "finanzielleAngaben/kinder/kinder-frage",
      "finanzielleAngaben/besitz/eigentum-info",
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: "10.10.2020",
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
      "finanzielleAngaben/kinder/kinder/wohnort",
      "finanzielleAngaben/kinder/kinder/kind-eigene-einnahmen-frage",
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: "10.10.2020",
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
      "finanzielleAngaben/kinder/kinder/kind-eigene-einnahmen-frage",
      "finanzielleAngaben/kinder/kinder/kind-eigene-einnahmen",
    ],
  ],
  [
    { hasKinder: "yes" },
    [
      "finanzielleAngaben/kinder/uebersicht",
      "finanzielleAngaben/besitz/eigentum-info",
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: "10.10.2020",
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
      "finanzielleAngaben/kinder/kinder/wohnort",
      "finanzielleAngaben/kinder/kinder/kind-unterhalt-frage",
    ],
  ],
  [
    {
      kinder: [
        {
          vorname: "vorname",
          nachname: "nachname",
          geburtsdatum: "10.10.2020",
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
      "finanzielleAngaben/kinder/kinder/kind-unterhalt-frage",
      "finanzielleAngaben/kinder/kinder/kind-unterhalt",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenKinder = {
  machine,
  cases,
};
