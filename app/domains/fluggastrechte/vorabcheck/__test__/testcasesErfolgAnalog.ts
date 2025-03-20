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

const EU_AIRLINE = "LH";
const NON_EU_AIRLINE = "DL";
const SONSTIGES_AIRLINE = "sonstiges";

const baseContext: FluggastrechtVorabcheckContext = {
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
};

const validSteps = [
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
];

const cases = [
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "DRS",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "DRS",
      endAirport: "ERF",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "DRS",
      endAirport: "ERF",
      fluggesellschaft: NON_EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "DRS",
      endAirport: "ERF",
      fluggesellschaft: SONSTIGES_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "BER",
      endAirport: "MUC",
      fluggesellschaft: SONSTIGES_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "DRS",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "DRS",
      fluggesellschaft: NON_EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "DRS",
      fluggesellschaft: SONSTIGES_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "BER",
      fluggesellschaft: SONSTIGES_AIRLINE,
    },
    validSteps,
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testcasesFluggastrechteErfolgAnalog = {
  machine,
  cases,
};
