import type {
  FlowTestCases,
  FlowTestConfig,
} from "~/domains/__test__/TestCases";
import type { NachlassErbausschlagungAnfrageUserData } from "../userData";
import { nachlassErbausschlagungAnfrageXStateConfig } from "~/domains/nachlass/erbausschlagung/anfrage/xStateConfig";

export const nachlassErbausschlagungAnfrageTestCases = {
  xstateConfig: nachlassErbausschlagungAnfrageXStateConfig,
  testcases: {} satisfies FlowTestCases<NachlassErbausschlagungAnfrageUserData>,
} satisfies FlowTestConfig<NachlassErbausschlagungAnfrageUserData>;
