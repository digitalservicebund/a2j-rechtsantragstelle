import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_PILOT_COURT = "10823";
const ZIP_CODE_EDGE_CASE_SECONDARY = "53111";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal5000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
};

export const testCasesGerichtSuchenMiete = [
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
      postleitzahlSecondary: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
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
      mietePachtVertrag: "no",
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
      mietePachtVertrag: "no",
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
      mietePachtVertrag: "no",
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
      mietePachtVertrag: "no",
      klagendeKaufmann: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_PILOT_COURT,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
