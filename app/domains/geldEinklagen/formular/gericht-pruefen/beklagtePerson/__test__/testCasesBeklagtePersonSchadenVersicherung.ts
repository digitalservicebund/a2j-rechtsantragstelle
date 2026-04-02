import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/beklagte-person": true,
    },
  },
};

export const testCasesBeklagteSchadenVersicherung = [
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
      klagendeKaufmann: "yes",
      gegenWenBeklagen: "person",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
      klagendeKaufmann: "yes",
      gegenWenBeklagen: "person",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
      gegenWenBeklagen: "person",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      klagendeKaufmann: "yes",
      gegenWenBeklagen: "person",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      klagendeKaufmann: "yes",
      gegenWenBeklagen: "person",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      gegenWenBeklagen: "person",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
