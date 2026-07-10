import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { nachlassErbscheinAnfrageFlowConfig } from "~/domains/nachlass/erbschein/anfrage/flowConfig";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { verstorbenePersonTestCases } from "~/domains/nachlass/erbschein/anfrage/verstorbene-person/__test__/testCasesWithUserInput";

export const nachlassErbscheinAnfrageTestCases = {
  xstateConfig: {
    id: "/nachlass/erbschein/anfrage",
  },
  newEngineConfig: nachlassErbscheinAnfrageFlowConfig,
  testcases: {
    datenverarbeitung: [
      {
        stepId: "/start",
      },
      {
        stepId: "/start/datenverarbeitung",
        userInput: { datenverarbeitungZustimmung: "on" },
      },
      {
        stepId: "/verstorbene/name",
      },
    ],
    ...verstorbenePersonTestCases,
  },
} satisfies FlowTestConfig<
  NachlassErbscheinAnfrageUserData,
  typeof nachlassErbscheinAnfrageFlowConfig.pages
>;
