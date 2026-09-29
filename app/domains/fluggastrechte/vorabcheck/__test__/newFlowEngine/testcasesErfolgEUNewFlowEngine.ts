import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";
import { erfolgOhneGerichtHappyPath, verspaetetHappyPath } from "./happyPaths";

export const testCasesFluggastrechteErfolgEUNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "start-eu-destination-eu-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "CDG" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-eu-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "CDG" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-eu-sonstiges-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "CDG" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-outside-eu-sonstiges-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "IAD" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-outside-eu-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "IAD" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-outside-eu-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "IAD" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-outside-eu-destination-eu-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "IAD", endAirport: "AMS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
  };
