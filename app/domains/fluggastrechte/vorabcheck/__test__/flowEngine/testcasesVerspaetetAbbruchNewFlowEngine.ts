import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";
import { fluggastrechteSteps, verspaetetHappyPath } from "./happyPaths";

export const testCasesFluggastrechteVerspaetetAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "bereich-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "anderes" },
      },
      {
        stepId: "/ergebnis/bereich-abbruch",
      },
    ],
    "verspaetung-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "no" },
      },
      {
        stepId: "/ergebnis/verspaetung-abbruch",
      },
    ],
    "checkin-abbruch": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "AF" },
      },
      {
        stepId: "/checkin",
        userInput: { checkin: "no" },
      },
      {
        stepId: "/ergebnis/checkin-abbruch",
      },
    ],
    "flughaefen-outside-eu-abbruch": [
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "GRU", endAirport: "JFK" },
      },
      {
        stepId: "/ergebnis/flughaefen-abbruch",
      },
    ],
    "fluggesellschaft-nicht-eu-abbruch": [
      ...verspaetetHappyPath,
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
    "flughaefen-entfernung-abbruch": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "XXX", endAirport: "XXX" },
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/ergebnis/flughaefen-entfernung-abbruch",
      },
    ],
    "kostenlos-abbruch": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      fluggastrechteSteps.checkinYes,
      {
        stepId: "/kostenlos",
        userInput: { kostenlos: "yes" },
      },
      {
        stepId: "/ergebnis/kostenlos-abbruch",
      },
    ],
    "rabatt-abbruch": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      fluggastrechteSteps.checkinYes,
      fluggastrechteSteps.kostenlosNo,
      {
        stepId: "/rabatt",
        userInput: { rabatt: "yes" },
      },
      {
        stepId: "/ergebnis/rabatt-abbruch",
      },
    ],
    "buchung-abbruch": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      fluggastrechteSteps.checkinYes,
      fluggastrechteSteps.kostenlosNo,
      fluggastrechteSteps.rabattNo,
      {
        stepId: "/buchung",
        userInput: { buchung: "no" },
      },
      {
        stepId: "/ergebnis/buchung-abbruch",
      },
    ],
    "abtretung-abbruch": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      fluggastrechteSteps.checkinYes,
      fluggastrechteSteps.kostenlosNo,
      fluggastrechteSteps.rabattNo,
      fluggastrechteSteps.buchungYes,
      {
        stepId: "/abtretung",
        userInput: { abtretung: "yes" },
      },
      {
        stepId: "/ergebnis/abtretung-abbruch",
      },
    ],
  };
