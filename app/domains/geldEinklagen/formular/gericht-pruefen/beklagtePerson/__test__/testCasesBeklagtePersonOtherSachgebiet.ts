import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "anderesRechtsproblem",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/beklagte-person": true,
    },
    arrayIndexes: [],
  },
};

export const testCasesBeklagteOtherSachgebiet = [
  [
    {
      ...baseContext,
      klagendeVerbraucher: "no",
      gegenWenBeklagen: "person",
      klagendeKaufmann: "yes",
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
      gegenWenBeklagen: "person",
      klagendeKaufmann: "yes",
      klagendeVerbraucher: "no",
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
      gegenWenBeklagen: "person",
      klagendeKaufmann: "yes",
      klagendeVerbraucher: "no",
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
      gegenWenBeklagen: "person",
      klagendeKaufmann: "yes",
      klagendeVerbraucher: "no",
      beklagtePersonKaufmann: "unknown",
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
      gegenWenBeklagen: "person",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
