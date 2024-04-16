import type { TestCases } from "../TestCases";
import { guards } from "~/models/flows/fluggastrechte/guards";
import fluggastrechte from "~/models/flows/fluggastrechte/config.json";
import type { FluggastrechtVorabcheckContext } from "~/models/flows/fluggastrechte/context";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { createMachine } from "xstate";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechte, context: {} },
  { guards },
);

const cases = [
  [
    {
      startAirport: "BER",
      endAirport: "MUN",
      fluggesellschaft: "airfrance",
      bereich: "verspaetet",
      verspaetung: "yes",
      checkin: "yes",
      gruende: "yes",
      entschaedigung: "yes",
      gericht: "no",
      abtretung: "no",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
    },
    [
      "start",
      "flughaefen",
      "fluggesellschaft",
      "bereich",
      "verspaetung",
      "checkin",
      "gruende",
      "gruende-hinweis",
      "entschaedigung",
      "gericht",
      "abtretung",
      "kostenlos",
      "rabatt",
      "buchung",
      "ergebnis/erfolg",
    ],
  ],
  [
    {
      startAirport: "GRU",
      endAirport: "JFK",
    },
    ["start", "flughaefen", "ergebnis/flughaefen-abbruch"],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechte = {
  machine,
  cases,
};
