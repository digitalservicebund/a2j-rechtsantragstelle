import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal5000" as const,
  ausgeschlossen: "yes" as const,
  fuerWenKlagen: "selbst" as const,
  sachgebiet: "anderesRechtsproblem" as const,
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
