import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testCasesFluggastrechteNichtBefoerderungVertretbareGruendeNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "nichtbefoerderung-vertretbare-gruende-hinweis": [
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
        userInput: { vertretbareGruende: "yes" },
      },
      {
        stepId: "/vertretbare-gruende-info",
      },
      {
        stepId: "/verjaehrung",
      },
    ],
  };
