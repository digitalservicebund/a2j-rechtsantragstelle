import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const ZIP_CODE_EDGE_CASE = "14197";

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
      strasseSekundaer: "street",
      strasseNummerSekundaer: "number",
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
      strasseSekundaer: "street",
      strasseNummerSekundaer: "number",
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
      strasseBeklagte: "street",
      strasseNummerBeklagte: "number",
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: "street",
      strasseNummerSekundaer: "number",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-klagende-person",
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
      klagendeHaustuergeschaeft: "no",
      postleitzahlBeklagtePerson: ZIP_CODE_EDGE_CASE,
      strasseBeklagte: "street",
      strasseNummerBeklagte: "number",
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
      strasseBeklagte: "street",
      strasseNummerBeklagte: "number",
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: "street",
      strasseNummerSekundaer: "number",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-unerlaubte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
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
      strasseBeklagte: "street",
      strasseNummerBeklagte: "number",
      postleitzahlSecondary: ZIP_CODE_EDGE_CASE,
      strasseSekundaer: "street",
      strasseNummerSekundaer: "number",
    },
    [
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
      "/gericht-pruefen/gericht-suchen/strasse-nummer-beklagte-person",
      "/gericht-pruefen/gericht-suchen/postleitzahl-verkehrsunfall",
      "/gericht-pruefen/gericht-suchen/strasse-nummer",
      "/gericht-pruefen/zustaendiges-gericht/pilot-gericht",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
