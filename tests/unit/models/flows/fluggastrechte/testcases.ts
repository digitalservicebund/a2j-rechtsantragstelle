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
      startAirport: "XXX",
      endAirport: "BER",
    },
    ["flughaefen", "ergebnis/flughaefen-entfernung-abbruch"],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechte = {
  machine,
  cases,
};
