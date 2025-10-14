import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { prozesskostenhilfeFormular } from "~/domains/prozesskostenhilfe/formular";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { testCasesPKHFormularFinanzielleAngabenWohnung } from "../finanzielleAngaben/__test__/testcasesWohnung";
import { type ProzesskostenhilfeFormularUserData } from "../userData";

const machine: FlowStateMachine = createMachine(
  { ...prozesskostenhilfeFormular.config, context: {} },
  { guards: prozesskostenhilfeFormular.guards },
);

const testCasesFormular = [
  ...testCasesPKHFormularFinanzielleAngabenWohnung,
  // ...testCasesProzesskostenhilfeDocumentUploadTransitions, // Uncomment when file upload is released
] satisfies TestCases<ProzesskostenhilfeFormularUserData>;

export const testCasesProzesskostenhilfeFormular = {
  machine,
  cases: testCasesFormular,
};
