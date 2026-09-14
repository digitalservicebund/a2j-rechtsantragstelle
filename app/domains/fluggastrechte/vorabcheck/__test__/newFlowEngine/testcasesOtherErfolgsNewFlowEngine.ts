import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testcasesFluggastrechtOtherErfolgsNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "verspaetet-erfolg-kontakt": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
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
        userInput: { startAirport: "JFK", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "AF" },
      },
      {
        stepId: "/checkin",
        userInput: { checkin: "yes" },
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
        userInput: { abtretung: "no" },
      },
      {
        stepId: "/entschaedigung",
        userInput: { entschaedigung: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-kontakt",
      },
    ],
    "verspaetet-erfolg-gericht": [
      {
        stepId: "/start",
      },
      {
        stepId: "/bereich",
        userInput: { bereich: "verspaetet" },
      },
      {
        stepId: "/verspaetung",
        userInput: { verspaetung: "yes" },
      },
      {
        stepId: "/gruende",
        userInput: { gruende: "yes" },
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
        userInput: { startAirport: "JFK", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "AF" },
      },
      {
        stepId: "/checkin",
        userInput: { checkin: "yes" },
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
        userInput: { abtretung: "no" },
      },
      {
        stepId: "/entschaedigung",
        userInput: { entschaedigung: "yes" },
      },
      {
        stepId: "/gericht",
        userInput: { gericht: "yes" },
      },
      {
        stepId: "/ergebnis/erfolg-gericht",
      },
    ],
    "annullierung-erfolg-gericht": [
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
        userInput: { ersatzflugStartenZweiStunden: "yes" },
      },
      {
        stepId: "/ersatzflug-landen-vier-stunden",
        userInput: { ersatzflugLandenVierStunden: "no" },
      },
      {
        stepId: "/vertretbare-gruende-annullierung",
        userInput: { vertretbareGruendeAnnullierung: "no" },
      },
      {
        stepId: "/verjaehrung",
        userInput: { verjaehrung: "yes" },
      },
      {
        stepId: "/flughaefen",
        userInput: { startAirport: "MUC", endAirport: "MUN" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "AF" },
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
        userInput: { abtretung: "no" },
      },
      {
        stepId: "/entschaedigung",
        userInput: { entschaedigung: "yes" },
      },
      {
        stepId: "/gericht",
        userInput: { gericht: "yes" },
      },
      {
        stepId: "/ergebnis/erfolg-gericht",
      },
    ],
    "nichtbefoerderung-erfolg-gericht": [
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
        userInput: { startAirport: "JFK", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "AF" },
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
        userInput: { abtretung: "no" },
      },
      {
        stepId: "/entschaedigung",
        userInput: { entschaedigung: "yes" },
      },
      {
        stepId: "/gericht",
        userInput: { gericht: "yes" },
      },
      {
        stepId: "/ergebnis/erfolg-gericht",
      },
    ],
  };
