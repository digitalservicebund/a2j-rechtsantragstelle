import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal5000" as const,
  sachgebietAusgeschlossen: "yes" as const,
};

export const testCasesGeldEinklagenVerkehrsunfallSchaden = [
  [
    {
      ...baseContext,
      besondere: "schaden",
      fuerWenKlagen: "organisation",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/ergebnis/abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "schaden",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "schaden",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "verkehrsunfall",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
  [
    {
      ...baseContext,
      besondere: "verkehrsunfall",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/fuer-wen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
