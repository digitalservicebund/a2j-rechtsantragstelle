import { type TestCases } from "~/domains/__test__/TestCases";
import { type GeldEinklagenFormularUserData } from "../../../userData";

const baseContext: GeldEinklagenFormularUserData = {
  anwaltschaft: "no",
  forderung: "maximal10000",
  ausgeschlossen: "yes",
  pageData: {
    subflowDoneStates: {
      "/gericht-pruefen/klagende-person": true,
    },
  },
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
