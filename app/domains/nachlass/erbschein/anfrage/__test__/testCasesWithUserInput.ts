import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { antragstellendePersonTestCases } from "~/domains/nachlass/erbschein/anfrage/antragstellende-person/__test__/testCasesWithUserInput";
import { ehepartnerTestCases } from "~/domains/nachlass/erbschein/anfrage/ehepartner/__test__/testCasesWithUserInput";
import { nachlassErbscheinAnfrageFlowConfig } from "~/domains/nachlass/erbschein/anfrage/flowConfig";
import { testamentOderErbvertragTestCases } from "~/domains/nachlass/erbschein/anfrage/testament-oder-erbvertrag/__test__/testCasesWithUserInput";
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
    ...antragstellendePersonTestCases,
    ...testamentOderErbvertragTestCases,
    ...ehepartnerTestCases,
  },
} satisfies FlowTestConfig<
  NachlassErbscheinAnfrageUserData,
  typeof nachlassErbscheinAnfrageFlowConfig.pages
>;
