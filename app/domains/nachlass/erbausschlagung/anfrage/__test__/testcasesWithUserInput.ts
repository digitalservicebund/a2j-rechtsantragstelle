import type {
  FlowTestCases,
  FlowTestConfig,
} from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";
import { verstorbeneTestCases } from "../verstorbene/__test__/testcasesWithUserInput";
import { ausschlagendePersonTestCases } from "../ausschlagendePerson/__test__/testcasesWithUserInput";
import { kinderTestCases } from "../kinder/__test__/testcasesWithUserInput";

export const nachlassErbausschlagungAnfrageTestCases = {
  xstateConfig: nachlassErbausschlagungAnfrageXStateConfig,
  testcases: {
    defaultStartNachlassErbausschlagungAnfrage: [
      {
        stepId: "/start/start",
      },
      {
        stepId: "/start/datenverarbeitung",
        userInput: {
          datenverarbeitungZustimmung: "on",
        },
      },
      {
        stepId: "/verstorbene/name",
      },
    ],
    ...verstorbeneTestCases,
    ...ausschlagendePersonTestCases,
    ...kinderTestCases,
  } satisfies FlowTestCases<NachlassErbausschlagungAnfrageUserData>,
} satisfies FlowTestConfig<NachlassErbausschlagungAnfrageUserData>;
