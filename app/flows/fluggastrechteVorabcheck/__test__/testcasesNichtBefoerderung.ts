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
      bereich: "nichtbefoerderung",
      ausgleich: "no",
      ausgleichAngenommen: "no",
      checkin: "no",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "checkin-nicht-befoerderung",
      "ergebnis/checkin-abbruch",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "no",
      ausgleichAngenommen: "no",
      checkin: "yes",
      vertretbareGruende: "yes",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "checkin-nicht-befoerderung",
      "vertretbare-gruende",
      "ergebnis/vertretbare-gruende-abbruch",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "yes",
      ausgleichAngenommen: "no",
      vertretbareGruende: "no",
      checkin: "yes",
      verjaehrung: "yes",
      startAirport: "JFK",
      endAirport: "AMS",
      fluggesellschaft: "sonstiges",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "ausgleich-angenommen",
      "checkin-nicht-befoerderung",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-abbruch-eu",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "yes",
      ausgleichAngenommen: "no",
      vertretbareGruende: "no",
      startAirport: "JFK",
      endAirport: "BER",
      checkin: "yes",
      verjaehrung: "yes",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "ausgleich-angenommen",
      "checkin-nicht-befoerderung",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "yes",
      ausgleichAngenommen: "no",
      vertretbareGruende: "no",
      startAirport: "CDG",
      endAirport: "DRS",
      fluggesellschaft: "DL",
      checkin: "yes",
      verjaehrung: "yes",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "ausgleich-angenommen",
      "checkin-nicht-befoerderung",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "yes",
      ausgleichAngenommen: "no",
      vertretbareGruende: "no",
      checkin: "yes",
      verjaehrung: "yes",
      startAirport: "CDG",
      endAirport: "DRS",
      fluggesellschaft: "sonstiges",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "ausgleich-angenommen",
      "checkin-nicht-befoerderung",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "yes",
      ausgleichAngenommen: "no",
      vertretbareGruende: "no",
      checkin: "yes",
      verjaehrung: "yes",
      startAirport: "CDG",
      endAirport: "BER",
      fluggesellschaft: "DL",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "ausgleich-angenommen",
      "checkin-nicht-befoerderung",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
      "ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteNichtBefoerderung = {
  machine,
  cases,
};
