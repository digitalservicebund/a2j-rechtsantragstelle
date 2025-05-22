import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import { type BeratungshilfeRechtsproblemUserData } from "~/domains/beratungshilfe/formular/rechtsproblem/userData";

const cases = [
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

export const testCasesBeratungshilfeRechtsproblem = {
  machine,
  cases,
};
