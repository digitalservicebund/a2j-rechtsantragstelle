import type { FlowTestCases } from "~/domains/__test__/TestCases";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { reachRechtsproblem } from "~/domains/beratungshilfe/formular/__test__/reachData";

export const testCasesBeratungshilfeRechtsproblem = {
  rechtsProblem: [
    {
      stepId: "/rechtsproblem/start",
      skipPageSchemaValidation: true,
      userInput: { ...reachRechtsproblem },
    },
    {
      stepId: "/rechtsproblem/bereich",
      userInput: {
        bereich: "other",
      },
    },
    {
      stepId: "/rechtsproblem/situation-beschreibung",
      userInput: {
        gegenseite: "gegenseite",
        beschreibung: "beschreibung",
        ziel: "ziel",
        eigeninitiativeBeschreibung: "eigeninitiative",
      },
    },
    {
      stepId: "/finanzielle-angaben/einkommen/start",
    },
  ],
} satisfies FlowTestCases<BeratungshilfeFormularUserData>;
