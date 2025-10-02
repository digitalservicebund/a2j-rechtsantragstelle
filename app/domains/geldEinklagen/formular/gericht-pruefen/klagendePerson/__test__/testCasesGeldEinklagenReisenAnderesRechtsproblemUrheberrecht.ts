import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal5000" as const,
  sachgebietAusgeschlossen: "yes" as const,
  fuerWenKlagen: "selbst" as const,
};

export const testCasesGeldEinklagenReisenAnderesRechtsproblemUrheberrecht = [
  [
    {
      ...baseContext,
      besondere: "reisen",
      klagendeVerbraucher: "no",
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
      besondere: "reisen",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/vertrag",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "reisen",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/vertrag",
      "/gericht-pruefen/klagende-person/haustuergeschaeft",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "anderesRechtsproblem",
      klagendeVerbraucher: "no",
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
      besondere: "anderesRechtsproblem",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/vertrag",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "anderesRechtsproblem",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/vertrag",
      "/gericht-pruefen/klagende-person/haustuergeschaeft",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "urheberrecht",
      klagendeVerbraucher: "no",
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
      besondere: "urheberrecht",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/vertrag",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "urheberrecht",
      klagendeVerbraucher: "yes",
      klagendeVertrag: "yes",
      klagendeHaustuergeschaeft: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/verbraucher",
      "/gericht-pruefen/klagende-person/vertrag",
      "/gericht-pruefen/klagende-person/haustuergeschaeft",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
