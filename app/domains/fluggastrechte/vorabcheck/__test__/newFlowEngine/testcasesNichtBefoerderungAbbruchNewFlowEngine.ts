import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testCasesFluggastrechteNichtBefoerderungAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
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
    "checkin-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "nichtbefoerderung" },
      },
      {
        stepId: "/ausgleich",
        userInput: { ausgleich: "no" },
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: { checkin: "no" },
      },
      {
        stepId: "/ergebnis/checkin-abbruch",
      },
    ],
    "verjaehrung-abbruch": [
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
        userInput: { ausgleichAngenommen: "no" },
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
        userInput: { verjaehrung: "no" },
      },
      {
        stepId: "/ergebnis/verjaehrung-abbruch",
      },
    ],
    "kostenlos-abbruch": [
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
        userInput: { ausgleichAngenommen: "no" },
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
      {
        stepId: "/kostenlos",
        userInput: { kostenlos: "yes" },
      },
      {
        stepId: "/ergebnis/kostenlos-abbruch",
      },
    ],
    "rabatt-abbruch": [
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
        userInput: { ausgleichAngenommen: "no" },
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
      {
        stepId: "/kostenlos",
        userInput: { kostenlos: "no" },
      },
      {
        stepId: "/rabatt",
        userInput: { rabatt: "yes" },
      },
      {
        stepId: "/ergebnis/rabatt-abbruch",
      },
    ],
    "buchung-abbruch": [
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
        userInput: { ausgleichAngenommen: "no" },
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
      {
        stepId: "/kostenlos",
        userInput: { kostenlos: "no" },
      },
      {
        stepId: "/rabatt",
        userInput: { rabatt: "no" },
      },
      {
        stepId: "/buchung",
        userInput: { buchung: "no" },
      },
      {
        stepId: "/ergebnis/buchung-abbruch",
      },
    ],
    "abtretung-abbruch": [
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
        userInput: { ausgleichAngenommen: "no" },
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
      {
        stepId: "/kostenlos",
        userInput: { kostenlos: "no" },
      },
      {
        stepId: "/rabatt",
        userInput: { rabatt: "no" },
      },
      {
        stepId: "/buchung",
        userInput: { buchung: "yes" },
      },
      {
        stepId: "/abtretung",
        userInput: { abtretung: "yes" },
      },
      {
        stepId: "/ergebnis/abtretung-abbruch",
      },
    ],
  };
