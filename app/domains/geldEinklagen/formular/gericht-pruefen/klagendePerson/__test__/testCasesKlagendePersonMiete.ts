import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal5000" as const,
  ausgeschlossen: "yes" as const,
  fuerWenKlagen: "selbst" as const,
  sachgebiet: "miete" as const,
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
      "/gericht-pruefen/beklagte-person/fuer-wen",
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
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      klagendeVerbraucher: "no",
      mietePachtVertrag: "no",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/fuer-wen",
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
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
