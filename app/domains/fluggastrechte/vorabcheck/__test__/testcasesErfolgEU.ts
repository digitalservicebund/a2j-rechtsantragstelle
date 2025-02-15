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

const cases = [
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
      startAirport: "AMS",
      endAirport: "CDG",
      fluggesellschaft: "LH",
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
      "/checkin",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg-eu",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
      startAirport: "AMS",
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
      "/checkin",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg-eu",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
      startAirport: "AMS",
      endAirport: "CDG",
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
      "/checkin",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg-eu",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
      startAirport: "AMS",
      endAirport: "IAD",
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
      "/checkin",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg-eu",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
      startAirport: "AMS",
      endAirport: "IAD",
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
      "/checkin",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg-eu",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
      startAirport: "AMS",
      endAirport: "IAD",
      fluggesellschaft: "LH",
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
      "/checkin",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg-eu",
    ],
  ],
  [
    {
      bereich: "verspaetet",
      verspaetung: "yes",
      gruende: "yes",
      verjaehrung: "yes",
      checkin: "yes",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
      startAirport: "IAD",
      endAirport: "AMS",
      fluggesellschaft: "LH",
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
      "/checkin",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg-eu",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteErfolgEU = {
  machine,
  cases,
};
