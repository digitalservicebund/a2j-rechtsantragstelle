import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";

const baseContext: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
};

export const testCasesFluggastrechteFluggesellschaftAbbruch = [
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "BER",
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
      "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "DRS",
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
      "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
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
      "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "BER",
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
      "/ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "DRS",
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
      "/ergebnis/fluggesellschaft-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      startAirport: "JFK",
      endAirport: "AMS",
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
      "/ergebnis/fluggesellschaft-abbruch-eu",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckUserData>;
