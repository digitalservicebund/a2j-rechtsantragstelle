import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

const annullierungAbbruch1Context: FluggastrechtVorabcheckUserData = {
  bereich: "anderes",
};

const annullierungAbbruch2Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "no",
  ersatzflug: "yes",
  ersatzflugStartenEinStunde: "no",
  ersatzflugLandenZweiStunden: "no",
};

const annullierungAbbruch3Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "until6Days",
  ersatzflug: "yes",
  ersatzflugStartenEinStunde: "no",
  ersatzflugLandenZweiStunden: "no",
};

const annullierungAbbruch4Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "between7And13Days",
  ersatzflug: "yes",
  ersatzflugStartenZweiStunden: "no",
  ersatzflugLandenVierStunden: "no",
  vertretbareGruendeAnnullierung: "no",
  verjaehrung: "yes",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "AF",
  kostenlos: "no",
  rabatt: "no",
  buchung: "yes",
  abtretung: "no",
  entschaedigung: "yes",
  gericht: "yes",
};

const annullierungAbbruch5Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "moreThan13Days",
};

const annullierungAbbruch6Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "no",
  vertretbareGruendeAnnullierung: "yes",
  verjaehrung: "no",
  ersatzflug: "no",
};

const annullierungAbbruch7Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "no",
  vertretbareGruendeAnnullierung: "yes",
  verjaehrung: "yes",
  ersatzflug: "no",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "yes",
};

const annullierungAbbruch8Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "no",
  vertretbareGruendeAnnullierung: "yes",
  verjaehrung: "yes",
  ersatzflug: "no",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "no",
  rabatt: "yes",
};

const annullierungAbbruch9Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "no",
  vertretbareGruendeAnnullierung: "yes",
  verjaehrung: "yes",
  ersatzflug: "no",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "no",
  rabatt: "no",
  buchung: "no",
};

const annullierungAbbruch10Context: FluggastrechtVorabcheckUserData = {
  bereich: "annullierung",
  ankuendigung: "no",
  vertretbareGruendeAnnullierung: "yes",
  verjaehrung: "yes",
  ersatzflug: "no",
  startAirport: "FRA",
  endAirport: "MUC",
  fluggesellschaft: "LH",
  kostenlos: "no",
  rabatt: "no",
  buchung: "yes",
  abtretung: "yes",
};

export const testCasesFluggastrechteAnnullierungAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "annullierung-abbruch-1": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch1Context,
      },
      {
        stepId: "/ergebnis/bereich-abbruch",
      },
    ],
    "annullierung-abbruch-2": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch2Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch2Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch2Context,
      },
      {
        stepId: "/ersatzflug-starten-eine-stunde",
        userInput: annullierungAbbruch2Context,
      },
      {
        stepId: "/ersatzflug-landen-zwei-stunden",
        userInput: annullierungAbbruch2Context,
      },
      {
        stepId: "/ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
      },
    ],
    "annullierung-abbruch-3": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch3Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch3Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch3Context,
      },
      {
        stepId: "/ersatzflug-starten-eine-stunde",
        userInput: annullierungAbbruch3Context,
      },
      {
        stepId: "/ersatzflug-landen-zwei-stunden",
        userInput: annullierungAbbruch3Context,
      },
      {
        stepId: "/ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
      },
    ],
    "annullierung-abbruch-4": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch4Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch4Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch4Context,
      },
      {
        stepId: "/ersatzflug-starten-zwei-stunden",
        userInput: annullierungAbbruch4Context,
      },
      {
        stepId: "/ersatzflug-landen-vier-stunden",
        userInput: annullierungAbbruch4Context,
      },
      {
        stepId: "/ergebnis/ersatzflug-starten-zwei-landen-vier-abbruch",
      },
    ],
    "annullierung-abbruch-5": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch5Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch5Context,
      },
      {
        stepId: "/ergebnis/ankuendigung-abbruch",
      },
    ],
    "annullierung-abbruch-6": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch6Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch6Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch6Context,
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: annullierungAbbruch6Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: annullierungAbbruch6Context,
      },
      {
        stepId: "/ergebnis/verjaehrung-abbruch",
      },
    ],
    "annullierung-abbruch-7": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/flughaefen",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/kostenlos",
        userInput: annullierungAbbruch7Context,
      },
      {
        stepId: "/ergebnis/kostenlos-abbruch",
      },
    ],
    "annullierung-abbruch-8": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/flughaefen",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/kostenlos",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/rabatt",
        userInput: annullierungAbbruch8Context,
      },
      {
        stepId: "/ergebnis/rabatt-abbruch",
      },
    ],
    "annullierung-abbruch-9": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/flughaefen",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/kostenlos",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/rabatt",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/buchung",
        userInput: annullierungAbbruch9Context,
      },
      {
        stepId: "/ergebnis/buchung-abbruch",
      },
    ],
    "annullierung-abbruch-10": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/ankuendigung",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/ersatzflug",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/gruende-hinweis",
      },
      {
        stepId: "/verjaehrung",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/flughaefen",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/fluggesellschaft",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/kostenlos",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/rabatt",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/buchung",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/abtretung",
        userInput: annullierungAbbruch10Context,
      },
      {
        stepId: "/ergebnis/abtretung-abbruch",
      },
    ],
  };
