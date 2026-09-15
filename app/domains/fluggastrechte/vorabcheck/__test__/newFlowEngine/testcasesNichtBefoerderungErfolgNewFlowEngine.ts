import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";
import {
  anspruchVoraussetzungenHappyPath,
  fluggastrechteSteps,
} from "./happyPaths";

export const testCasesFluggastrechteNichtBefoerderungErfolgNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "nichtbefoerderung-erfolg": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "nichtbefoerderung" },
      },
      {
        stepId: "/ausgleich",
        userInput: { ausgleich: "yes" },
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: { ausgleichAngenommen: "yes" },
      },
      {
        stepId: "/ausgleich-angenommen-info",
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: { checkin: "yes" },
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: { vertretbareGruende: "no" },
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
      },
      ...anspruchVoraussetzungenHappyPath,
      fluggastrechteSteps.entschaedigungYes,
      fluggastrechteSteps.gerichtNo,
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
  };
