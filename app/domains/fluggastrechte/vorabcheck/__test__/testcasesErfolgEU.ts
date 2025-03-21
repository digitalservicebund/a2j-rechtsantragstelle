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
  "/ergebnis/erfolg-eu",
];

const cases = [
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "CDG",
      fluggesellschaft: "LH",
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "CDG",
      fluggesellschaft: "DL",
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "CDG",
      fluggesellschaft: "sonstiges",
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "IAD",
      fluggesellschaft: "sonstiges",
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "IAD",
      fluggesellschaft: "DL",
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "IAD",
      fluggesellschaft: "LH",
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "IAD",
      endAirport: "AMS",
      fluggesellschaft: "LH",
    },
    validSteps,
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckContext>;

export const testCasesFluggastrechteErfolgEU = {
  machine,
  cases,
};
