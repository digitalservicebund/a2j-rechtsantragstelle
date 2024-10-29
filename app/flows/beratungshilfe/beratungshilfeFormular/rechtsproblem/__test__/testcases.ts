import type { TestCases } from "~/flows/__test__/TestCases";
import { machine } from "~/flows/beratungshilfe/beratungshilfeFormular/__test__/testMachine";
import { type BeratungshilfeRechtsproblem } from "~/flows/beratungshilfe/beratungshilfeFormular/rechtsproblem/context";

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
      "rechtsproblem/start",
      "rechtsproblem/bereich",
      "rechtsproblem/situation-beschreibung",
      "finanzielle-angaben/einkommen/start",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeRechtsproblem>;

export const testCasesBeratungshilfeRechtsproblem = {
  machine,
  cases,
};
