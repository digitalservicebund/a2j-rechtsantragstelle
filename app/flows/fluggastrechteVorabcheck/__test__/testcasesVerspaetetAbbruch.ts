import { createMachine } from "xstate";
import type { TestCases } from "~/flows/__test__/TestCases";
import type { FluggastrechtVorabcheckContext } from "~/flows/fluggastrechteVorabcheck/context";
import fluggastrechte from "~/flows/fluggastrechteVorabcheck/flow.json";
import { guards } from "~/flows/fluggastrechteVorabcheck/guards";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechte, context: {} },
  { guards },
);

const cases = [
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "AF",
      checkin: "no",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "checkin",
      "ergebnis/checkin-abbruch",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      startAirport: "GRU",
      endAirport: "JFK",
    },
    ["flughaefen", "ergebnis/flughaefen-abbruch"],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "CDG",
      endAirport: "DRS",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "CDG",
      endAirport: "DRS",
      fluggesellschaft: "sonstiges",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "AMS",
      endAirport: "BER",
      fluggesellschaft: "sonstiges",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "JFK",
      endAirport: "AMS",
      fluggesellschaft: "sonstiges",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-abbruch-eu",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "CDG",
      endAirport: "BER",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteVerspaetetAbbruch = {
  machine,
  cases,
};
