import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckContext } from "~/domains/fluggastrechte/vorabcheck/context";
import fluggastrechte from "~/domains/fluggastrechte/vorabcheck/flow.json";
import { guards } from "~/domains/fluggastrechte/vorabcheck/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechte, context: {} },
  { guards },
);

const baseContext: FluggastrechtVorabcheckContext = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
};

const cases = [
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "DL",
    },
    [
      "/start",
      "/bereich",
      "/verspaetung",
      "/gruende",
      "/gruende-hinweis",
      "/verjaehrung",
      "/flughaefen",
      "/fluggesellschaft",
      "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "DRS",
      fluggesellschaft: "DL",
    },
    [
      "/start",
      "/bereich",
      "/verspaetung",
      "/gruende",
      "/gruende-hinweis",
      "/verjaehrung",
      "/flughaefen",
      "/fluggesellschaft",
      "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "CDG",
      fluggesellschaft: "DL",
    },
    [
      "/start",
      "/bereich",
      "/verspaetung",
      "/gruende",
      "/gruende-hinweis",
      "/verjaehrung",
      "/flughaefen",
      "/fluggesellschaft",
      "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "CDG",
      endAirport: "DRS",
      fluggesellschaft: "sonstiges",
    },
    [
      "/start",
      "/bereich",
      "/verspaetung",
      "/gruende",
      "/gruende-hinweis",
      "/verjaehrung",
      "/flughaefen",
      "/fluggesellschaft",
      "/ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "BER",
      fluggesellschaft: "sonstiges",
    },
    [
      "/start",
      "/bereich",
      "/verspaetung",
      "/gruende",
      "/gruende-hinweis",
      "/verjaehrung",
      "/flughaefen",
      "/fluggesellschaft",
      "/ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "AMS",
      fluggesellschaft: "sonstiges",
    },
    [
      "/start",
      "/bereich",
      "/verspaetung",
      "/gruende",
      "/gruende-hinweis",
      "/verjaehrung",
      "/flughaefen",
      "/fluggesellschaft",
      "/ergebnis/fluggesellschaft-abbruch-eu",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteFluggesellschaftAbbruch = {
  machine,
  cases,
};
