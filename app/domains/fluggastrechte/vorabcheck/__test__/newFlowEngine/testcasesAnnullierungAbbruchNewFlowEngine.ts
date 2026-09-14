import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testCasesFluggastrechteAnnullierungAbbruchNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
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
    "ersatzflug-starten-eine-landen-zwei-abbruch-no": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "no" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "yes" },
      },
      {
        stepId: "/ersatzflug-starten-eine-stunde",
        userInput: { ersatzflugStartenEinStunde: "no" },
      },
      {
        stepId: "/ersatzflug-landen-zwei-stunden",
        userInput: { ersatzflugLandenZweiStunden: "no" },
      },
      {
        stepId: "/ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
      },
    ],
    "ersatzflug-starten-eine-landen-zwei-abbruch-until-6-days": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "until6Days" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "yes" },
      },
      {
        stepId: "/ersatzflug-starten-eine-stunde",
        userInput: { ersatzflugStartenEinStunde: "no" },
      },
      {
        stepId: "/ersatzflug-landen-zwei-stunden",
        userInput: { ersatzflugLandenZweiStunden: "no" },
      },
      {
        stepId: "/ergebnis/ersatzflug-starten-eine-landen-zwei-abbruch",
      },
    ],
    "ersatzflug-starten-zwei-landen-vier-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "between7And13Days" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "yes" },
      },
      {
        stepId: "/ersatzflug-starten-zwei-stunden",
        userInput: { ersatzflugStartenZweiStunden: "no" },
      },
      {
        stepId: "/ersatzflug-landen-vier-stunden",
        userInput: { ersatzflugLandenVierStunden: "no" },
      },
      {
        stepId: "/ergebnis/ersatzflug-starten-zwei-landen-vier-abbruch",
      },
    ],
    "ankuendigung-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "moreThan13Days" },
      },
      {
        stepId: "/ergebnis/ankuendigung-abbruch",
      },
    ],
    "verjaehrung-abbruch": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "no" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "no" },
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: { vertretbareGruendeAnnullierung: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
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
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "no" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "no" },
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: { vertretbareGruendeAnnullierung: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
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
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "no" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "no" },
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: { vertretbareGruendeAnnullierung: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
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
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "no" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "no" },
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: { vertretbareGruendeAnnullierung: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
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
        userInput: { bereich: "annullierung" },
      },
      {
        stepId: "/ankuendigung",
        userInput: { ankuendigung: "no" },
      },
      {
        stepId: "/ersatzflug",
        userInput: { ersatzflug: "no" },
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: { vertretbareGruendeAnnullierung: "yes" },
      },
      {
        stepId: "/gruende-hinweis",
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
