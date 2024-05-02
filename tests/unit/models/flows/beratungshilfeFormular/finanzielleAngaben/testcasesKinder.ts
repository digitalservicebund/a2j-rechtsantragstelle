import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const cases = [
  [
    { hasKinder: "yes" },
    [
      "finanzielle-angaben/kinder/kinder-frage",
      "finanzielle-angaben/kinder/uebersicht",
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
    ],
  ],
  [
    { hasKinder: "no" },
    [
      "finanzielle-angaben/kinder/kinder-frage",
      "finanzielle-angaben/andere-unterhaltszahlungen/frage",
    ],
  ],
  [
    {},
    [
      "finanzielle-angaben/kinder/kinder/name",
      "finanzielle-angaben/kinder/kinder/wohnort",
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
      "finanzielle-angaben/kinder/kinder/name",
      "finanzielle-angaben/kinder/kinder/wohnort",
      "finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen-frage",
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
      "finanzielle-angaben/kinder/kinder/name",
      "finanzielle-angaben/kinder/kinder/wohnort",
      "finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen-frage",
      "finanzielle-angaben/kinder/kinder/kind-eigene-einnahmen",
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
      "finanzielle-angaben/kinder/kinder/name",
      "finanzielle-angaben/kinder/kinder/wohnort",
      "finanzielle-angaben/kinder/kinder/kind-unterhalt-frage",
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
      "finanzielle-angaben/kinder/kinder/name",
      "finanzielle-angaben/kinder/kinder/wohnort",
      "finanzielle-angaben/kinder/kinder/kind-unterhalt-frage",
      "finanzielle-angaben/kinder/kinder/kind-unterhalt-ende",
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
      "finanzielle-angaben/kinder/kinder/name",
      "finanzielle-angaben/kinder/kinder/wohnort",
      "finanzielle-angaben/kinder/kinder/kind-unterhalt-frage",
      "finanzielle-angaben/kinder/kinder/kind-unterhalt",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenKinder = {
  machine,
  cases,
};
