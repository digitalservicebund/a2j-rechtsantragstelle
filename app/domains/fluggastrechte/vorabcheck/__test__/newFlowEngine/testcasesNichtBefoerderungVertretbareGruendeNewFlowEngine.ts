import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const nichtbefoerderungVertretbareGruende1Context: FluggastrechtVorabcheckUserData =
  {
    bereich: "nichtbefoerderung",
    ausgleich: "yes",
    ausgleichAngenommen: "yes",
    checkin: "yes",
    vertretbareGruende: "yes",
  };

export const testCasesFluggastrechteNichtBefoerderungVertretbareGruendeNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "nichtbefoerderung-vertretbare-gruende-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungVertretbareGruende1Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungVertretbareGruende1Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: nichtbefoerderungVertretbareGruende1Context,
      },
      {
        stepId: "/ausgleich-angenommen-info",
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungVertretbareGruende1Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: nichtbefoerderungVertretbareGruende1Context,
      },
      {
        stepId: "/vertretbare-gruende-info",
      },
      {
        stepId: "/verjaehrung",
        userInput: nichtbefoerderungVertretbareGruende1Context,
      },
    ],
  };
