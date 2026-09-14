import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testCasesFluggastrechteFluggesellschaftAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "fluggesellschaft-nicht-eu-airline-destination-germany-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      {
        stepId: "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
      },
    ],
    "fluggesellschaft-nicht-eu-airline-destination-dresden-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      {
        stepId: "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
      },
    ],
    "fluggesellschaft-nicht-eu-airline-destination-eu-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "CDG" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      {
        stepId: "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
      },
    ],
    "fluggesellschaft-sonstiges-airline-destination-germany-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      {
        stepId: "/ergebnis/fluggesellschaft-abbruch",
      },
    ],
    "fluggesellschaft-sonstiges-airline-destination-dresden-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      {
        stepId: "/ergebnis/fluggesellschaft-abbruch",
      },
    ],
    "fluggesellschaft-sonstiges-airline-destination-eu-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "AMS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      {
        stepId: "/ergebnis/fluggesellschaft-abbruch-eu",
      },
    ],
  };
