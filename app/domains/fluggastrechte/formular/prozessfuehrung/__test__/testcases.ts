import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { fluggastrechteGuards } from "../../guards";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const cases = [
  [
    {
      versaeumnisurteil: "yes",
      videoverhandlung: "yes",
    },
    [
      "/prozessfuehrung/videoverhandlung",
      "/prozessfuehrung/versaeumnisurteil",
      "/prozessfuehrung/zahlung-nach-klageeinreichung",
      "/zusammenfassung/start",
      "/abgabe/start",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularProzessfuehrung = {
  machine,
  cases,
};
