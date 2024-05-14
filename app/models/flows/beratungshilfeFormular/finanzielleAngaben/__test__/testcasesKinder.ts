/* eslint-disable @typescript-eslint/ban-ts-comment */
import { machine } from "~/models/flows/beratungshilfeFormular/__test__/testMachine";
import type { TestCases } from "~/models/flows/__test__/TestCases";
import type { BeratungshilfeFinanzielleAngaben } from "~/models/flows/beratungshilfeFormular/finanzielleAngaben/context";

const finanzielleAngabenKinderKinderName =
  "finanzielle-angaben/kinder/kinder/name";
const finanzielleAngabenKinderKinderWohnort =
  "finanzielle-angaben/kinder/kinder/wohnort";
const finanzielleAngabenKinderKinderKindUnterhaltFrage =
  "finanzielle-angaben/kinder/kinder/kind-unterhalt-frage";
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
    [finanzielleAngabenKinderKinderName, finanzielleAngabenKinderKinderWohnort],
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
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
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
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
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
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      finanzielleAngabenKinderKinderKindUnterhaltFrage,
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
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      finanzielleAngabenKinderKinderKindUnterhaltFrage,
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
      finanzielleAngabenKinderKinderName,
      finanzielleAngabenKinderKinderWohnort,
      finanzielleAngabenKinderKinderKindUnterhaltFrage,
      "finanzielle-angaben/kinder/kinder/kind-unterhalt",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeFinanzielleAngaben>;

export const testCasesBeratungshilfeFormularFinanzielleAngabenKinder = {
  machine,
  cases,
};
