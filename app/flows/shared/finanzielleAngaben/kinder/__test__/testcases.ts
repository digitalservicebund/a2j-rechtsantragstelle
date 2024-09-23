import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import type { KinderContext } from "../context";
import { getkinderXstateConfig } from "../xstateConfig";

export const machine: FlowStateMachine = createMachine(getkinderXstateConfig());

const cases = [
  [{ hasKinder: "yes" }, ["kinder-frage", "uebersicht", "warnung"]],
  [
    {
      hasKinder: "yes",
      kinder: [
        {
          vorname: "test",
          nachname: "nach",
          eigeneEinnahmen: "no",
          wohnortBeiAntragsteller: "no",
          einnahmen: "0",
          unterhalt: "no",
          unterhaltsSumme: "0",
          geburtsdatum: "01.01.2001",
        },
      ],
    },
    ["kinder-frage", "uebersicht"],
  ],
  [
    {
      hasKinder: "yes",
      kinder: [
        {
          vorname: "test",
          nachname: "nach",
          eigeneEinnahmen: "yes",
          wohnortBeiAntragsteller: "yes",
          einnahmen: "0",
          unterhalt: "no",
          unterhaltsSumme: "0",
          geburtsdatum: "01.01.2001",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "kinder/name",
      "kinder/wohnort",
      "kinder/kind-eigene-einnahmen-frage",
      "kinder/kind-eigene-einnahmen",
    ],
  ],
  [
    {
      hasKinder: "yes",
      kinder: [
        {
          vorname: "test",
          nachname: "nach",
          eigeneEinnahmen: "yes",
          wohnortBeiAntragsteller: "no",
          einnahmen: "0",
          unterhalt: "yes",
          unterhaltsSumme: "0",
          geburtsdatum: "01.01.2001",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "kinder/name",
      "kinder/wohnort",
      "kinder/kind-unterhalt-frage",
      "kinder/kind-unterhalt",
    ],
  ],
  [
    {
      hasKinder: "yes",
      kinder: [
        {
          vorname: "test",
          nachname: "nach",
          eigeneEinnahmen: "yes",
          wohnortBeiAntragsteller: "no",
          einnahmen: "0",
          unterhalt: "no",
          unterhaltsSumme: "0",
          geburtsdatum: "01.01.2001",
        },
      ],
      pageData: { arrayIndexes: [0] },
    },
    [
      "kinder/name",
      "kinder/wohnort",
      "kinder/kind-unterhalt-frage",
      "kinder/kind-unterhalt-ende",
    ],
  ],
] as const satisfies TestCases<KinderContext>;

export const testCasesKinderSubflow = {
  machine,
  cases,
};
