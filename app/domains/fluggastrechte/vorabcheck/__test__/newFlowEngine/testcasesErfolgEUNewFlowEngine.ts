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

const erfolgEu1Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "CDG",
  fluggesellschaft: "LH",
};

const erfolgEu2Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "CDG",
  fluggesellschaft: "DL",
};

const erfolgEu3Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "CDG",
  fluggesellschaft: "sonstiges",
};

const erfolgEu4Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "IAD",
  fluggesellschaft: "sonstiges",
};

const erfolgEu5Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "IAD",
  fluggesellschaft: "DL",
};

const erfolgEu6Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "IAD",
  fluggesellschaft: "LH",
};

const erfolgEu7Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "IAD",
  endAirport: "AMS",
  fluggesellschaft: "LH",
};

export const testCasesFluggastrechteErfolgEUNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "erfolg-eu-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgEu1Context,
      },
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "erfolg-eu-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgEu2Context,
      },
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "erfolg-eu-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgEu3Context,
      },
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "erfolg-eu-4": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgEu4Context,
      },
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "erfolg-eu-5": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgEu5Context,
      },
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "erfolg-eu-6": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgEu6Context,
      },
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "erfolg-eu-7": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgEu7Context,
      },
      {
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
  };
