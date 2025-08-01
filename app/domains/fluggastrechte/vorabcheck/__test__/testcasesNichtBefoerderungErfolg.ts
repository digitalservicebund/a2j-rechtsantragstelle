import type { TestCases } from "~/domains/__test__/TestCases";
import type { FluggastrechtVorabcheckUserData } from "~/domains/fluggastrechte/vorabcheck/userData";

export const testCasesFluggastrechteNichtBefoerderungErfolg = [
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "yes",
      ausgleichAngenommen: "yes",
      checkin: "yes",
      vertretbareGruende: "no",
      verjaehrung: "yes",
      startAirport: "FRA",
      endAirport: "BER",
      fluggesellschaft: "LH",
      kostenlos: "no",
      rabatt: "no",
      buchung: "yes",
      abtretung: "no",
      entschaedigung: "yes",
      gericht: "no",
    },
    [
      "/start",
      "/bereich",
      "/ausgleich",
      "/ausgleich-angenommen",
      "/ausgleich-angenommen-info",
      "/checkin-nicht-befoerderung",
      "/vertretbare-gruende",
      "/verjaehrung",
      "/flughaefen",
      "/fluggesellschaft",
      "/kostenlos",
      "/rabatt",
      "/buchung",
      "/abtretung",
      "/entschaedigung",
      "/gericht",
      "/ergebnis/erfolg",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckUserData>;

export const testCasesFluggastrechteNichtBefoerderungVertretbareGruende = [
  [
    {
      bereich: "nichtbefoerderung",
      ausgleich: "yes",
      ausgleichAngenommen: "yes",
      checkin: "yes",
      vertretbareGruende: "yes",
    },
    [
      "/start",
      "/bereich",
      "/ausgleich",
      "/ausgleich-angenommen",
      "/ausgleich-angenommen-info",
      "/checkin-nicht-befoerderung",
      "/vertretbare-gruende",
      "/vertretbare-gruende-info",
      "/verjaehrung",
    ],
  ],
] as const satisfies TestCases<FluggastrechtVorabcheckUserData>;
