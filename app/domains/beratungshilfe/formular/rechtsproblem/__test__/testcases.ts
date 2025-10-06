import type { FlowTestCases } from "~/domains/__test__/TestCases";

export const testCasesBeratungshilfeRechtsproblem = {
  rechtsProblem: [
    {
      stepId: "/rechtsproblem/start",
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
} satisfies FlowTestCases["testcases"];
