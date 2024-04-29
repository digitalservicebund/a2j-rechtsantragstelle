import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { hasKinder: "yes" },
    [
      "finanzielleAngaben/kinder/kinder-frage",
      "finanzielleAngaben/kinder/uebersicht",
      "finanzielleAngaben/andere-unterhaltszahlungen/frage",
    ],
  ],
  [
    { hasKinder: "no" },
    [
      "finanzielleAngaben/kinder/kinder-frage",
      "finanzielleAngaben/andere-unterhaltszahlungen/frage",
    ],
  ],
  [
    {},
    [
      "finanzielleAngaben/kinder/kinder/name",
      "finanzielleAngaben/kinder/kinder/wohnort",
    ],
  ],
  [
    {
      kinder: [
        // @ts-ignore
        {
          wohnortBeiAntragsteller: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/kinder/kinder/name",
      "finanzielleAngaben/kinder/kinder/wohnort",
      "finanzielleAngaben/kinder/kinder/kind-eigene-einnahmen-frage",
    ],
  ],
  [
    {
      kinder: [
        // @ts-ignore
        {
          wohnortBeiAntragsteller: "yes",
          eigeneEinnahmen: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/kinder/kinder/name",
      "finanzielleAngaben/kinder/kinder/wohnort",
      "finanzielleAngaben/kinder/kinder/kind-eigene-einnahmen-frage",
      "finanzielleAngaben/kinder/kinder/kind-eigene-einnahmen",
    ],
  ],
  [
    {
      kinder: [
        // @ts-ignore
        {
          wohnortBeiAntragsteller: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/kinder/kinder/name",
      "finanzielleAngaben/kinder/kinder/wohnort",
      "finanzielleAngaben/kinder/kinder/kind-unterhalt-frage",
    ],
  ],
  [
    {
      kinder: [
        // @ts-ignore
        {
          wohnortBeiAntragsteller: "no",
          unterhalt: "no",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/kinder/kinder/name",
      "finanzielleAngaben/kinder/kinder/wohnort",
      "finanzielleAngaben/kinder/kinder/kind-unterhalt-frage",
      "finanzielleAngaben/kinder/kinder/kind-unterhalt-ende",
    ],
  ],
  [
    {
      kinder: [
        // @ts-ignore
        {
          wohnortBeiAntragsteller: "no",
          unterhalt: "yes",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "finanzielleAngaben/kinder/kinder/name",
      "finanzielleAngaben/kinder/kinder/wohnort",
      "finanzielleAngaben/kinder/kinder/kind-unterhalt-frage",
      "finanzielleAngaben/kinder/kinder/kind-unterhalt",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenKinder = {
  machine,
  cases,
};
