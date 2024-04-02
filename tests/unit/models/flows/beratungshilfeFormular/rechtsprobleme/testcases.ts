import { machine } from "../testMachine";
import type { TestCases } from "../../TestCases";
import { type BeratungshilfeRechtsproblem } from "~/models/flows/beratungshilfeFormular/rechtsproblem/context";

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
      "finanzielleAngaben/einkommen/staatliche-leistungen",
    ],
  ],
] as const satisfies TestCases<BeratungshilfeRechtsproblem>;

export const testCasesBeratungshilfeRechtsproblem = {
  machine,
  cases,
};
