import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  fuerWenKlagen: "selbst",
  sachgebiet: "miete",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/klagende-person": true,
    },
  },
};

export const testCasesKlagendePersonMiete = [
  [
    {
      ...baseContext,
      klagendeVerbraucher: "yes",
      mietePachtVertrag: "yes",
      mietePachtRaum: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVerbraucher: "no",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVerbraucher: "yes",
      mietePachtVertrag: "yes",
      mietePachtRaum: "no",
      klagendeHaustuergeschaeft: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/haustuergeschaeft",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      mietePachtVertrag: "no",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
