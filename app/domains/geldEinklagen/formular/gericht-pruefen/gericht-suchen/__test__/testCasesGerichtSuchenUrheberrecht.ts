import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "76133"; // AG Mannheim zip code
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "urheberrecht",
  gegenWenBeklagen: "person",
};

export const testCasesGerichtSuchenUrheberrecht = [
  [
    {
      ...baseContext,
      klagendeKaufmann: "yes",
      klagendeVerbraucher: "no",
      beklagtePersonGeldVerdienen: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
      postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeKaufmann: "yes",
      beklagtePersonGeldVerdienen: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeKaufmann: "yes",
      beklagtePersonGeldVerdienen: "yes",
      beklagtePersonKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeKaufmann: "yes",
      beklagtePersonGeldVerdienen: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "yes",
      beklagtePersonGeldVerdienen: "yes",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "yes",
      beklagtePersonGeldVerdienen: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "yes",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeKaufmann: "yes",
      beklagtePersonGeldVerdienen: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: "10823", // Berlin AG Schöneberg zip code NON-PILOT
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
