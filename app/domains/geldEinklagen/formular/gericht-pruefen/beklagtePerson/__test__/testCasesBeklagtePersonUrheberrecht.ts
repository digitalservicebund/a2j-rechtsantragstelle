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
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "no",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "no",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      beklagtePersonGeldVerdienen: "yes",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      klagendeVerbraucher: "no",
      beklagtePersonGeldVerdienen: "yes",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "yes",
      gerichtsstandsvereinbarung: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suchen/postleitzahl-gerichtsstandsvereinbarung",
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
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gerichtsstandsvereinbarung",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
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
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
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
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
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
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/geld-verdienen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "organisation",
      klagendeVerbraucher: "no",
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
      gegenWenBeklagen: "organisation",
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
      gegenWenBeklagen: "organisation",
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
      gegenWenBeklagen: "organisation",
      klagendeKaufmann: "yes",
      beklagtePersonKaufmann: "unknown",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/beklagte-person/kaufmann",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
