import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const verspaetetAbbruch1Context: FluggastrechtVorabcheckUserData = {
  bereich: "anderes",
};

const verspaetetAbbruch2Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "no",
};

const verspaetetAbbruch3Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "JFK",
  endAirport: "MUC",
  fluggesellschaft: "AF",
  checkin: "no",
};

const verspaetetAbbruch4Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  startAirport: "GRU",
  endAirport: "JFK",
};

const verspaetetAbbruch5Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "JFK",
  endAirport: "MUC",
  fluggesellschaft: "DL",
};

const verspaetetAbbruch6Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "XXX",
  endAirport: "XXX",
};

const verspaetetAbbruch7Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "yes",
  checkin: "yes",
};

const verspaetetAbbruch8Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  checkin: "yes",
  kostenlos: "no",
  rabatt: "yes",
};

const verspaetetAbbruch9Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  checkin: "yes",
  kostenlos: "no",
  rabatt: "no",
  buchung: "no",
};

const verspaetetAbbruch10Context: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  checkin: "yes",
  kostenlos: "no",
  rabatt: "no",
  buchung: "yes",
  abtretung: "yes",
};

export const testCasesFluggastrechteVerspaetetAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "verspaetet-abbruch-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch1Context,
      },
      {
        stepId: "/ergebnis/bereich-abbruch",
      },
    ],
    "verspaetet-abbruch-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch2Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch2Context,
      },
      {
        stepId: "/ergebnis/verspaetung-abbruch",
      },
    ],
    "verspaetet-abbruch-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch3Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch3Context,
      },
      {
        stepId: "/gruende",
        userInput: verspaetetAbbruch3Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: verspaetetAbbruch3Context,
      },
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch3Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: verspaetetAbbruch3Context,
      },
      {
        stepId: "/checkin",
        userInput: verspaetetAbbruch3Context,
      },
      {
        stepId: "/ergebnis/checkin-abbruch",
      },
    ],
    "verspaetet-abbruch-4": [
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch4Context,
      },
      {
        stepId: "/ergebnis/flughaefen-abbruch",
      },
    ],
    "verspaetet-abbruch-5": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch5Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch5Context,
      },
      {
        stepId: "/gruende",
        userInput: verspaetetAbbruch5Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: verspaetetAbbruch5Context,
      },
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch5Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: verspaetetAbbruch5Context,
      },
      {
        stepId: "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
      },
    ],
    "verspaetet-abbruch-6": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch6Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch6Context,
      },
      {
        stepId: "/gruende",
        userInput: verspaetetAbbruch6Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: verspaetetAbbruch6Context,
      },
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch6Context,
        skipPageSchemaValidation: true,
      },
      {
        stepId: "/ergebnis/flughaefen-entfernung-abbruch",
      },
    ],
    "verspaetet-abbruch-7": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/gruende",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/checkin",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/kostenlos",
        userInput: verspaetetAbbruch7Context,
      },
      {
        stepId: "/ergebnis/kostenlos-abbruch",
      },
    ],
    "verspaetet-abbruch-8": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/gruende",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/checkin",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/kostenlos",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/rabatt",
        userInput: verspaetetAbbruch8Context,
      },
      {
        stepId: "/ergebnis/rabatt-abbruch",
      },
    ],
    "verspaetet-abbruch-9": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/gruende",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/checkin",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/kostenlos",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/rabatt",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/buchung",
        userInput: verspaetetAbbruch9Context,
      },
      {
        stepId: "/ergebnis/buchung-abbruch",
      },
    ],
    "verspaetet-abbruch-10": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/verspaetung",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/gruende",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/flughaefen",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/checkin",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/kostenlos",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/rabatt",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/buchung",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/abtretung",
        userInput: verspaetetAbbruch10Context,
      },
      {
        stepId: "/ergebnis/abtretung-abbruch",
      },
    ],
  };
