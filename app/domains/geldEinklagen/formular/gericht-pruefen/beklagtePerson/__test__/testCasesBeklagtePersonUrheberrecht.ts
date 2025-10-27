import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal5000" as const,
  ausgeschlossen: "yes" as const,
  fuerWenKlagen: "selbst" as const,
  sachgebiet: "urheberrecht" as const,
};

export const testCasesBeklagtePersonUrheberrecht = [
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "no",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "unknown",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "yes",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
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
      gegenWenBeklagen: "organisation",
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
      gegenWenBeklagen: "organisation",
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
      gegenWenBeklagen: "organisation",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "unknown",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
