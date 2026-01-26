import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
const ZIP_CODE_EDGE_CASE_SECONDARY = "53111";

const baseContext = {
  forderung: "maximal10000" as const,
  ausgeschlossen: "yes" as const,
  fuerWenKlagen: "selbst" as const,
  sachgebiet: "schaden" as const,
  gegenWenBeklagen: "person" as const,
};

export const testCasesGerichtSuchenSchaden = [
  [
    {
      ...baseContext,
      klagendeKaufmann: "yes",
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
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE_SECONDARY,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
