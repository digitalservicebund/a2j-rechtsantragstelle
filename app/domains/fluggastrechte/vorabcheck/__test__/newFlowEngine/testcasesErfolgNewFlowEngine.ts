import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";
import { erfolgOhneGerichtHappyPath, verspaetetHappyPath } from "./happyPaths";

export const testCasesFluggastrechteErfolgNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "start-outside-eu-destination-germany-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-outside-eu-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "JFK" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-eu-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "AMS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-outside-eu-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "JFK" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-eu-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "AMS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "domestic-germany-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "domestic-germany-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-eu-destination-germany-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-eu-destination-germany-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
  };
