import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";

const EU_AIRLINE = "LH";
const NON_EU_AIRLINE = "DL";
const SONSTIGES_AIRLINE = "sonstiges";

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
  "/ergebnis/erfolg-analog",
];

export const testcasesFluggastrechteErfolgAnalog = [
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
] as const satisfies TestCases<FluggastrechtVorabcheckUserData>;
