import type { TestCases } from "~/domains/__test__/TestCases";
import { machine } from "~/domains/beratungshilfe/formular/__test__/testMachine";
import { type BeratungshilfeRechtsproblem } from "~/domains/beratungshilfe/formular/rechtsproblem/context";

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
] as const satisfies TestCases<BeratungshilfeRechtsproblem>;

export const testCasesBeratungshilfeRechtsproblem = {
  machine,
  cases,
};
