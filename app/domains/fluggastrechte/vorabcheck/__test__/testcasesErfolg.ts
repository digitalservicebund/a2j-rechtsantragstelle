import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { guards } from "~/domains/fluggastrechte/vorabcheck/guards";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { fluggastrechteVorabcheckXstateConfig } from "../xstateConfig";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechteVorabcheckXstateConfig, context: {} },
  { guards },
);

const EU_AIRLINE = "LH";
const NON_EU_AIRLINE = "DL";

const baseContext: FluggastrechtVorabcheckUserData = {
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
  "/ergebnis/erfolg",
];

const cases = [
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "MUC",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "BER",
      endAirport: "JFK",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "BER",
      endAirport: "AMS",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "BER",
      endAirport: "JFK",
      fluggesellschaft: NON_EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "BER",
      endAirport: "AMS",
      fluggesellschaft: NON_EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "BER",
      endAirport: "MUC",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "BER",
      endAirport: "MUC",
      fluggesellschaft: NON_EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "MUC",
      fluggesellschaft: EU_AIRLINE,
    },
    validSteps,
  ],
  [
    {
      ...baseContext,
      startAirport: "AMS",
      endAirport: "MUC",
      fluggesellschaft: NON_EU_AIRLINE,
    },
    validSteps,
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckUserData>;

export const testCasesFluggastrechteErfolg = {
  machine,
  cases,
};
