import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_EDGE_CASE = "10789";
const STREET_EDGE_CASE = "bayreuther_str.";
const STREET_HOUSE_NUMBER_EDGE_CASE = "10";

const baseContext: GeldEinklagenFormularUserData = {
  forderung: "maximal5000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  gegenWenBeklagen: "person",
};

export const testCasesGerichtSuchenEdgeCasesZipCode = [
  [
    {
      ...baseContext,
      sachgebiet: "miete",
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: STREET_EDGE_CASE,
      strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
      "/gericht-pruefen/gericht-suchen/strasse-nummer",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "miete",
      mietePachtVertrag: "no",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: STREET_EDGE_CASE,
      strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suchen/strasse-nummer",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "miete",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "yes",
      postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
      strasseBeklagte: STREET_EDGE_CASE,
      strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: STREET_EDGE_CASE,
      strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "miete",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
      klagendeHaustuergeschaeft: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
      strasseBeklagte: STREET_EDGE_CASE,
      strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
      strasseBeklagte: STREET_EDGE_CASE,
      strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: STREET_EDGE_CASE,
      strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "verkehrsunfall",
      verkehrsunfallStrassenverkehr: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
      strasseBeklagte: STREET_EDGE_CASE,
      strasseNummerBeklagte: STREET_HOUSE_NUMBER_EDGE_CASE,
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: STREET_EDGE_CASE,
      strasseNummerSekundaer: STREET_HOUSE_NUMBER_EDGE_CASE,
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
      "/gericht-pruefen/gericht-suchen/strasse-nummer",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht-auswahl",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
