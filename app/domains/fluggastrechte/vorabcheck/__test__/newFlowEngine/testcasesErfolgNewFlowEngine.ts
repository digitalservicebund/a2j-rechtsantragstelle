import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const baseContext: FluggastrechtVorabcheckUserData = {
  bereich: "verspaetet",
  verspaetung: "yes",
  gruende: "yes",
  verjaehrung: "yes",
  checkin: "yes",
  kostenlos: "no",
  rabatt: "no",
  buchung: "yes",
  abtretung: "no",
  entschaedigung: "yes",
  gericht: "no",
};

const erfolg1Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "JFK",
  endAirport: "MUC",
  fluggesellschaft: "LH",
};

const erfolg2Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "FRA",
  endAirport: "JFK",
  fluggesellschaft: "LH",
};

const erfolg3Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "FRA",
  endAirport: "AMS",
  fluggesellschaft: "LH",
};

const erfolg4Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "FRA",
  endAirport: "JFK",
  fluggesellschaft: "DL",
};

const erfolg5Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "FRA",
  endAirport: "AMS",
  fluggesellschaft: "DL",
};

const erfolg6Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
};

const erfolg7Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "DL",
};

const erfolg8Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "MUC",
  fluggesellschaft: "LH",
};

const erfolg9Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "MUC",
  fluggesellschaft: "DL",
};

export const testCasesFluggastrechteErfolgNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "erfolg-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg1Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg1Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg1Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg1Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg1Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg1Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg1Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg1Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg1Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg1Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg1Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg1Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg1Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg2Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg2Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg2Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg2Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg2Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg2Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg2Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg2Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg2Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg2Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg2Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg2Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg2Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg3Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg3Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg3Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg3Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg3Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg3Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg3Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg3Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg3Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg3Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg3Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg3Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg3Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-4": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg4Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg4Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg4Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg4Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg4Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg4Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg4Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg4Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg4Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg4Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg4Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg4Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg4Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-5": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg5Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg5Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg5Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg5Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg5Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg5Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg5Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg5Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg5Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg5Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg5Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg5Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg5Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-6": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg6Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg6Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg6Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg6Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg6Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg6Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg6Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg6Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg6Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg6Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg6Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg6Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg6Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-7": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg7Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg7Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg7Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg7Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg7Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg7Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg7Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg7Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg7Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg7Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg7Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg7Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg7Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-8": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg8Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg8Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg8Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg8Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg8Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg8Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg8Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg8Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg8Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg8Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg8Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg8Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg8Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
    "erfolg-9": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolg9Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolg9Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolg9Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolg9Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolg9Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolg9Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolg9Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolg9Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolg9Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolg9Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolg9Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolg9Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolg9Context,
      },
      {
        stepId: "/ergebnis/erfolg",
      },
    ],
  };
