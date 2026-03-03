import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_BERLIN_PILOT_COURT = "10823";
const ZIP_CODE_EDGE_CASE_SECONDARY = "04103"; // Leipzig zip code
const ZIP_CODE_HAMBURG_PILOT_COURT = "20095";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "verkehrsunfall",
  gegenWenBeklagen: "person",
};

export const testCasesGerichtSuchenVerkehrsunfall = [
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
      postleitzahlSecondary: ZIP_CODE_BERLIN_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "no",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
      postleitzahlSecondary: ZIP_CODE_BERLIN_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "no",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "no",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "no",
      klagendeKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_BERLIN_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/ergebnis/gericht-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_HAMBURG_PILOT_COURT,
      strasseBeklagte: "Teststrasse",
      strasseNummerBeklagte: "1",
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
