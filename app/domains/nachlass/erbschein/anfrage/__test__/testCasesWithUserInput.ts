import { type FlowTestConfig } from "~/domains/__test__/TestCases";
import { antragstellendePersonTestCases } from "~/domains/nachlass/erbschein/anfrage/antragstellende-person/__test__/testCasesWithUserInput";
import { ehepartnerTestCases } from "~/domains/nachlass/erbschein/anfrage/ehepartner/__test__/testCasesWithUserInput";
import { nachlassErbscheinAnfrageFlowConfig } from "~/domains/nachlass/erbschein/anfrage/flowConfig";
import { nachlassTestCases } from "~/domains/nachlass/erbschein/anfrage/nachlass/__test__/testCasesWithUserInput";
import { testamentOderErbvertragTestCases } from "~/domains/nachlass/erbschein/anfrage/testament-oder-erbvertrag/__test__/testCasesWithUserInput";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";
import { verstorbenePersonTestCases } from "~/domains/nachlass/erbschein/anfrage/verstorbene-person/__test__/testCasesWithUserInput";
import { type CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import { type PageConfigMap } from "~/services/flow/newFlowEngine/types";

export const nachlassErbscheinAnfrageTestCases = {
  xstateConfig: {
    id: "/nachlass/erbschein/anfrage",
  },
  newEngineConfig:
    nachlassErbscheinAnfrageFlowConfig as CompiledFlow<PageConfigMap>,
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
    // ...angehoerigeTestCases,
    ...nachlassTestCases,
  },
} satisfies FlowTestConfig<NachlassErbscheinAnfrageUserData>;
