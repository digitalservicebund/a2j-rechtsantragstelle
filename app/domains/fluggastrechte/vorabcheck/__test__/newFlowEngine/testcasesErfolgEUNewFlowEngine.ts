import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testCasesFluggastrechteErfolgEUNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "start-eu-destination-eu-eu-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "CDG" },
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
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-eu-non-eu-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "CDG" },
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
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-eu-sonstiges-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "CDG" },
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
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-outside-eu-sonstiges-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "IAD" },
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
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-outside-eu-non-eu-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "IAD" },
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
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-eu-destination-outside-eu-eu-airline": [
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
        userInput: { startAirport: "AMS", endAirport: "IAD" },
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
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
    "start-outside-eu-destination-eu-eu-airline": [
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
        userInput: { startAirport: "IAD", endAirport: "AMS" },
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
        stepId: "/ergebnis/erfolg-eu",
      },
    ],
  };
