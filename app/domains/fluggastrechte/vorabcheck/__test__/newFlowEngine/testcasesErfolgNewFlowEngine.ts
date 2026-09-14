import type { FlowTestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "../../userData";

export const testCasesFluggastrechteErfolgNewFlowEngine: FlowTestCases<FluggastrechtVorabcheckUserData> =
  {
    "start-outside-eu-destination-germany-eu-airline": [
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-outside-eu-eu-airline": [
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
        userInput: { startAirport: "FRA", endAirport: "JFK" },
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-eu-eu-airline": [
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
        userInput: { startAirport: "FRA", endAirport: "AMS" },
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-outside-eu-non-eu-airline": [
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
        userInput: { startAirport: "FRA", endAirport: "JFK" },
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-germany-destination-eu-non-eu-airline": [
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
        userInput: { startAirport: "FRA", endAirport: "AMS" },
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "domestic-germany-eu-airline": [
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "domestic-germany-non-eu-airline": [
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-eu-destination-germany-eu-airline": [
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
        stepId: "/ergebnis/erfolg",
      },
    ],
    "start-eu-destination-germany-non-eu-airline": [
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
        stepId: "/ergebnis/erfolg",
      },
    ],
  };
