import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";

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

export const testCasesFluggastrechteErfolg = [
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
