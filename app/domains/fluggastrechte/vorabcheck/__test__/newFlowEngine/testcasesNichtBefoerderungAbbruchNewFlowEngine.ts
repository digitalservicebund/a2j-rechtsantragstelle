import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const nichtbefoerderungAbbruch1Context: FluggastrechtVorabcheckUserData = {
  bereich: "anderes",
};

const nichtbefoerderungAbbruch2Context: FluggastrechtVorabcheckUserData = {
  bereich: "nichtbefoerderung",
  ausgleich: "no",
  ausgleichAngenommen: "no",
  checkin: "no",
};

const nichtbefoerderungAbbruch3Context: FluggastrechtVorabcheckUserData = {
  bereich: "nichtbefoerderung",
  ausgleich: "yes",
  ausgleichAngenommen: "no",
  vertretbareGruende: "no",
  checkin: "yes",
  verjaehrung: "no",
};

const nichtbefoerderungAbbruch4Context: FluggastrechtVorabcheckUserData = {
  bereich: "nichtbefoerderung",
  ausgleich: "yes",
  ausgleichAngenommen: "no",
  vertretbareGruende: "no",
  checkin: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "yes",
};

const nichtbefoerderungAbbruch5Context: FluggastrechtVorabcheckUserData = {
  bereich: "nichtbefoerderung",
  ausgleich: "yes",
  ausgleichAngenommen: "no",
  vertretbareGruende: "no",
  checkin: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "no",
  rabatt: "yes",
};

const nichtbefoerderungAbbruch6Context: FluggastrechtVorabcheckUserData = {
  bereich: "nichtbefoerderung",
  ausgleich: "yes",
  ausgleichAngenommen: "no",
  vertretbareGruende: "no",
  checkin: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "no",
  rabatt: "no",
  buchung: "no",
};

const nichtbefoerderungAbbruch7Context: FluggastrechtVorabcheckUserData = {
  bereich: "nichtbefoerderung",
  ausgleich: "yes",
  ausgleichAngenommen: "no",
  vertretbareGruende: "no",
  checkin: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "no",
  rabatt: "no",
  buchung: "yes",
  abtretung: "yes",
};

export const testCasesFluggastrechteNichtBefoerderungAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "nichtbefoerderung-abbruch-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungAbbruch1Context,
      },
      {
        stepId: "/ergebnis/bereich-abbruch",
      },
    ],
    "nichtbefoerderung-abbruch-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungAbbruch2Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungAbbruch2Context,
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungAbbruch2Context,
      },
      {
        stepId: "/ergebnis/checkin-abbruch",
      },
    ],
    "nichtbefoerderung-abbruch-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungAbbruch3Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungAbbruch3Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: nichtbefoerderungAbbruch3Context,
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungAbbruch3Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: nichtbefoerderungAbbruch3Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: nichtbefoerderungAbbruch3Context,
      },
      {
        stepId: "/ergebnis/verjaehrung-abbruch",
      },
    ],
    "nichtbefoerderung-abbruch-4": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/flughaefen",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/kostenlos",
        userInput: nichtbefoerderungAbbruch4Context,
      },
      {
        stepId: "/ergebnis/kostenlos-abbruch",
      },
    ],
    "nichtbefoerderung-abbruch-5": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/flughaefen",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/kostenlos",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/rabatt",
        userInput: nichtbefoerderungAbbruch5Context,
      },
      {
        stepId: "/ergebnis/rabatt-abbruch",
      },
    ],
    "nichtbefoerderung-abbruch-6": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/flughaefen",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/kostenlos",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/rabatt",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/buchung",
        userInput: nichtbefoerderungAbbruch6Context,
      },
      {
        stepId: "/ergebnis/buchung-abbruch",
      },
    ],
    "nichtbefoerderung-abbruch-7": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/ausgleich",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/ausgleich-angenommen",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/checkin-nicht-befoerderung",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/vertretbare-gruende",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/verjaehrung",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/flughaefen",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/kostenlos",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/rabatt",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/buchung",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/abtretung",
        userInput: nichtbefoerderungAbbruch7Context,
      },
      {
        stepId: "/ergebnis/abtretung-abbruch",
      },
    ],
  };
