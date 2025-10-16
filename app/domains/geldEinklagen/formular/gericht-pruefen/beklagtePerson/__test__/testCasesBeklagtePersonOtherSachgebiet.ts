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
      fuerWenBeklagen: "person",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      fuerWenBeklagen: "person",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      fuerWenBeklagen: "person",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      fuerWenBeklagen: "person",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "unknown",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      fuerWenBeklagen: "person",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
