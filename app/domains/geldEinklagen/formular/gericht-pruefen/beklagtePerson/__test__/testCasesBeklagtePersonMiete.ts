import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  gegenWenBeklagen: "person",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/beklagte-person": true,
    },
    arrayIndexes: [],
  },
};

export const testCasesBeklagtePersonMiete = [
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-wohnraum",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "no",
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
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeVerbraucher: "yes",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "no",
    },
    [
      "/gericht-pruefen/beklagte-person/gegen-wen",
      "/gericht-pruefen/gericht-suchen/postleitzahl-beklagte-person",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
