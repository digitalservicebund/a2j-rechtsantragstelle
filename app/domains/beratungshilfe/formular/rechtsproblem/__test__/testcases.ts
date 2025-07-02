import type { TestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeRechtsproblemUserData } from "~/domains/beratungshilfe/formular/rechtsproblem/userData";

export const testCasesBeratungshilfeRechtsproblem = [
  [
    {
      bereich: "other",
      gegenseite: "gegenseite",
      beschreibung: "beschreibung",
      ziel: "ziel",
      eigeninitiativeBeschreibung: "eigeninitiative",
    },
    [
      "/rechtsproblem/start",
      "/rechtsproblem/bereich",
      "/rechtsproblem/situation-beschreibung",
      "/finanzielle-angaben/einkommen/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeRechtsproblemUserData>;
