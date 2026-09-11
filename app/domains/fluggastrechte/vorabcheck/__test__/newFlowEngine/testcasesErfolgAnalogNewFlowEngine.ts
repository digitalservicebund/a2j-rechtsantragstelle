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

const erfolgAnalog1Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "JFK",
  endAirport: "DRS",
  fluggesellschaft: "LH",
};

const erfolgAnalog2Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "DRS",
  endAirport: "ERF",
  fluggesellschaft: "LH",
};

const erfolgAnalog3Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "DRS",
  endAirport: "ERF",
  fluggesellschaft: "DL",
};

const erfolgAnalog4Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "DRS",
  endAirport: "ERF",
  fluggesellschaft: "sonstiges",
};

const erfolgAnalog5Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "sonstiges",
};

const erfolgAnalog6Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "DRS",
  fluggesellschaft: "LH",
};

const erfolgAnalog7Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "DRS",
  fluggesellschaft: "DL",
};

const erfolgAnalog8Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "DRS",
  fluggesellschaft: "sonstiges",
};

const erfolgAnalog9Context: FluggastrechtVorabcheckUserData = {
  ...baseContext,
  startAirport: "AMS",
  endAirport: "MUC",
  fluggesellschaft: "sonstiges",
};

export const testcasesFluggastrechteErfolgAnalogNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "erfolg-analog-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog1Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog2Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog3Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-4": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog4Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-5": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog5Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-6": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog6Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-7": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog7Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-8": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog8Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "erfolg-analog-9": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/verspaetung",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/gruende",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/flughaefen",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/checkin",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/kostenlos",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/rabatt",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/buchung",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/abtretung",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/entschaedigung",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/gericht",
        userInput: erfolgAnalog9Context,
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
  };
