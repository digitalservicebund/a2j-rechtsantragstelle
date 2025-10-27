import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal5000" as const,
  ausgeschlossen: "yes" as const,
  fuerWenKlagen: "selbst" as const,
  sachgebiet: "miete" as const,
};

export const testCasesBeklagtePersonMiete = [
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      gegenWenBeklagen: "person",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      gegenWenBeklagen: "person",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      gegenWenBeklagen: "person",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      gegenWenBeklagen: "person",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      gegenWenBeklagen: "person",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      gegenWenBeklagen: "person",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      gegenWenBeklagen: "organisation",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/fuer-wen",
      "/gericht-pruefen/gericht-suche/postleitzahl-beklagte-person",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
