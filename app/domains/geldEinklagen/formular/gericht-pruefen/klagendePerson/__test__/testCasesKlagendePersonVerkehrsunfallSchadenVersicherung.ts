import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext = {
  forderung: "maximal10000" as const,
  ausgeschlossen: "yes" as const,
};

export const testCasesKlagendePersonVerkehrsunfallSchadenVersicherung = [
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
      fuerWenKlagen: "organisation",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/ergebnis/organisation-abbruch",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "schaden",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "verkehrsunfall",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "verkehrsunfall",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "yes",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
  [
    {
      ...baseContext,
      sachgebiet: "versicherung",
      fuerWenKlagen: "selbst",
      klagendeKaufmann: "no",
    },
    [
      "/gericht-pruefen/klagende-person/fuer-wen",
      "/gericht-pruefen/klagende-person/kaufmann",
      "/gericht-pruefen/beklagte-person/gegen-wen",
    ],
  ],
] as const satisfies TestCases<GeldEinklagenFormularUserData>;
