import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const nichtbefoerderungErfolg1Context: FluggastrechtVorabcheckUserData = {
  bereich: "nichtbefoerderung",
  ausgleich: "yes",
  ausgleichAngenommen: "yes",
  checkin: "yes",
  vertretbareGruende: "no",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "no",
  rabatt: "no",
  buchung: "yes",
  abtretung: "no",
  entschaedigung: "yes",
  gericht: "no",
};

export const testCasesFluggastrechteNichtBefoerderungErfolgNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "nichtbefoerderung-erfolg-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/ausgleich-angenommen-info",
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/flughaefen",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/kostenlos",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/rabatt",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/buchung",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/abtretung",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/gericht",
        userInput: nichtbefoerderungErfolg1Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
  };
