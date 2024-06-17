import { createMachine } from "xstate";
import type { TestCases } from "~/models/flows/__test__/TestCases";
import fluggastrechte from "~/models/flows/fluggastrechte/config.json";
import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechte/context";
import { guards } from "~/models/flows/fluggastrechte/guards";
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
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "yes",
    },
    [
      "start",
      "bereich",
      "verspaetung",
      "gruende",
      "gruende-hinweis",
      "verjaehrung",
      "flughaefen",
      "checkin",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg-gericht",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "airfrance",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
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
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "airfrance",
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
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteVerspaetet = {
  machine,
  cases,
};
