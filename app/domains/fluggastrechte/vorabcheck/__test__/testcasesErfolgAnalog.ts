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
      endAirport: "DRS",
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
      "/ergebnis/erfolg-analog",
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
      startAirport: "DRS",
      endAirport: "ERF",
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
      "/ergebnis/erfolg-analog",
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
      startAirport: "DRS",
      endAirport: "ERF",
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
      "/ergebnis/erfolg-analog",
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
      startAirport: "DRS",
      endAirport: "ERF",
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
      "/ergebnis/erfolg-analog",
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
      startAirport: "BER",
      endAirport: "MUC",
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
      "/ergebnis/erfolg-analog",
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
      endAirport: "MUC",
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
      "/ergebnis/erfolg-analog",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testcasesFluggastrechteErfolgAnalog = {
  machine,
  cases,
};
