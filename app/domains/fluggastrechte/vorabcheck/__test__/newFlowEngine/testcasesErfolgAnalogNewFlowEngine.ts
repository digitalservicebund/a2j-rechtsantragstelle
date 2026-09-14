import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testcasesFluggastrechteErfolgAnalogNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "start-outside-eu-destination-dresden-eu-airline": [
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
        userInput: { startAirport: "JFK", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-dresden-destination-erfurt-eu-airline": [
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
        userInput: { startAirport: "DRS", endAirport: "ERF" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-dresden-destination-erfurt-non-eu-airline": [
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
        userInput: { startAirport: "DRS", endAirport: "ERF" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-dresden-destination-erfurt-sonstiges-airline": [
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
        userInput: { startAirport: "DRS", endAirport: "ERF" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "domestic-germany-sonstiges-airline": [
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
        userInput: { startAirport: "FRA", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-dresden-eu-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "LH" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-dresden-non-eu-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "DL" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-dresden-sonstiges-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "DRS" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
    "start-eu-destination-germany-sonstiges-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "MUC" },
      },
      {
        stepId: "/fluggesellschaft",
        userInput: { fluggesellschaft: "sonstiges" },
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
        userInput: { gericht: "no" },
      },
      {
        stepId: "/ergebnis/erfolg-analog",
      },
    ],
  };
