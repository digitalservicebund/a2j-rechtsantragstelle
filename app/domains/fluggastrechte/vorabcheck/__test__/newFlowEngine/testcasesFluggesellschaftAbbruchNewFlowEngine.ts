import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const baseContext: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  startAirport: "JFK",
};

const fluggesellschaftAbbruch1Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  endAirport: "MUC",
  fluggesellschaft: "DL",
};

const fluggesellschaftAbbruch2Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  endAirport: "DRS",
  fluggesellschaft: "DL",
};

const fluggesellschaftAbbruch3Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  endAirport: "CDG",
  fluggesellschaft: "DL",
};

const fluggesellschaftAbbruch4Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  endAirport: "MUC",
  fluggesellschaft: "sonstiges",
};

const fluggesellschaftAbbruch5Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  endAirport: "DRS",
  fluggesellschaft: "sonstiges",
};

const fluggesellschaftAbbruch6Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  endAirport: "AMS",
  fluggesellschaft: "sonstiges",
};

export const testCasesFluggastrechteFluggesellschaftAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "fluggesellschaft-abbruch-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: fluggesellschaftAbbruch1Context,
      },
      {
        stepId: "/verspaetung",
        userInput: fluggesellschaftAbbruch1Context,
      },
      {
        stepId: "/gruende",
        userInput: fluggesellschaftAbbruch1Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: fluggesellschaftAbbruch1Context,
      },
      {
        stepId: "/flughaefen",
        userInput: fluggesellschaftAbbruch1Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: fluggesellschaftAbbruch1Context,
      },
      {
        stepId: "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
      },
    ],
    "fluggesellschaft-abbruch-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: fluggesellschaftAbbruch2Context,
      },
      {
        stepId: "/verspaetung",
        userInput: fluggesellschaftAbbruch2Context,
      },
      {
        stepId: "/gruende",
        userInput: fluggesellschaftAbbruch2Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: fluggesellschaftAbbruch2Context,
      },
      {
        stepId: "/flughaefen",
        userInput: fluggesellschaftAbbruch2Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: fluggesellschaftAbbruch2Context,
      },
      {
        stepId: "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
      },
    ],
    "fluggesellschaft-abbruch-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: fluggesellschaftAbbruch3Context,
      },
      {
        stepId: "/verspaetung",
        userInput: fluggesellschaftAbbruch3Context,
      },
      {
        stepId: "/gruende",
        userInput: fluggesellschaftAbbruch3Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: fluggesellschaftAbbruch3Context,
      },
      {
        stepId: "/flughaefen",
        userInput: fluggesellschaftAbbruch3Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: fluggesellschaftAbbruch3Context,
      },
      {
        stepId: "/ergebnis/fluggesellschaft-nicht-eu-abbruch",
      },
    ],
    "fluggesellschaft-abbruch-4": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: fluggesellschaftAbbruch4Context,
      },
      {
        stepId: "/verspaetung",
        userInput: fluggesellschaftAbbruch4Context,
      },
      {
        stepId: "/gruende",
        userInput: fluggesellschaftAbbruch4Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: fluggesellschaftAbbruch4Context,
      },
      {
        stepId: "/flughaefen",
        userInput: fluggesellschaftAbbruch4Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: fluggesellschaftAbbruch4Context,
      },
      {
        stepId: "/ergebnis/fluggesellschaft-abbruch",
      },
    ],
    "fluggesellschaft-abbruch-5": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: fluggesellschaftAbbruch5Context,
      },
      {
        stepId: "/verspaetung",
        userInput: fluggesellschaftAbbruch5Context,
      },
      {
        stepId: "/gruende",
        userInput: fluggesellschaftAbbruch5Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: fluggesellschaftAbbruch5Context,
      },
      {
        stepId: "/flughaefen",
        userInput: fluggesellschaftAbbruch5Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: fluggesellschaftAbbruch5Context,
      },
      {
        stepId: "/ergebnis/fluggesellschaft-abbruch",
      },
    ],
    "fluggesellschaft-abbruch-6": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: fluggesellschaftAbbruch6Context,
      },
      {
        stepId: "/verspaetung",
        userInput: fluggesellschaftAbbruch6Context,
      },
      {
        stepId: "/gruende",
        userInput: fluggesellschaftAbbruch6Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: fluggesellschaftAbbruch6Context,
      },
      {
        stepId: "/flughaefen",
        userInput: fluggesellschaftAbbruch6Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: fluggesellschaftAbbruch6Context,
      },
      {
        stepId: "/ergebnis/fluggesellschaft-abbruch-eu",
      },
    ],
  };
