import type { TestCases } from "~/models/flows/__test__/TestCases";
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
      bereich: "nichtbefoerderung",
      compensation: "yes",
      compensationAccepted: "no",
      justifiableReasons: "no",
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "airfrance",
      verjaehrung: "yes",
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
      "ausgleich",
      "ausgleich-angenommen",
      "checkin",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
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
      bereich: "nichtbefoerderung",
      compensation: "no",
      justifiableReasons: "no",
      startAirport: "JFK",
      endAirport: "BER",
      fluggesellschaft: "airfrance",
      verjaehrung: "yes",
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
      "ausgleich",
      "checkin",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "fluggesellschaft",
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
      bereich: "nichtbefoerderung",
      compensation: "yes",
      compensationAccepted: "yes",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "ausgleich-angenommen",
      "ergebnis/ausgleich-angenommen-abbruch",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      compensation: "no",
      compensationAccepted: "no",
      checkin: "no",
    },
    ["start", "bereich", "ausgleich", "checkin", "ergebnis/checkin-abbruch"],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      compensation: "no",
      compensationAccepted: "no",
      checkin: "yes",
      justifiableReasons: "yes",
    },
    [
      "start",
      "bereich",
      "ausgleich",
      "checkin",
      "vertretbare-gruende",
      "ergebnis/vertretbare-gruende-abbruch",
    ],
  ],
  [
    {
      bereich: "nichtbefoerderung",
      compensation: "yes",
      compensationAccepted: "no",
      checkin: "yes",
      justifiableReasons: "no",
      verjaehrung: "yes",
      startAirport: "BER",
      endAirport: "MUN",
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
      "ausgleich",
      "ausgleich-angenommen",
      "checkin",
      "vertretbare-gruende",
      "verjaehrung",
      "flughaefen",
      "kostenlos",
      "rabatt",
      "buchung",
      "abtretung",
      "entschaedigung",
      "gericht",
      "ergebnis/erfolg",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechte = {
  machine,
  cases,
};
