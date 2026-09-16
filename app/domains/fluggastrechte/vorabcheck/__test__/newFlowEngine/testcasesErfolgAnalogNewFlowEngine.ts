import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";
import { erfolgOhneGerichtHappyPath, verspaetetHappyPath } from "./happyPaths";

export const testcasesFluggastrechteErfolgAnalogNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "start-outside-eu-destination-dresden-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "JFK", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-dresden-destination-erfurt-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "DRS", endAirport: "ERF" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-dresden-destination-erfurt-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "DRS", endAirport: "ERF" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-dresden-destination-erfurt-sonstiges-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "DRS", endAirport: "ERF" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "domestic-germany-sonstiges-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-dresden-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-dresden-non-eu-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-dresden-sonstiges-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-germany-sonstiges-airline": [
      ...verspaetetHappyPath,
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "AMS", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
      },
      ...erfolgOhneGerichtHappyPath,
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
  };
