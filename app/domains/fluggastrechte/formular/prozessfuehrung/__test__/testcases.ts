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
      schriftlichesVerfahren: "yes",
      versaeumnisurteil: "yes",
      videoverhandlung: "yes",
    },
    [
      "prozessfuehrung/schriftliches-verfahren",
      "prozessfuehrung/videoverhandlung",
      "prozessfuehrung/zahlung-nach-klageeinreichung",
      "prozessfuehrung/versaeumnisurteil",
      "zusammenfassung/start",
    ],
  ],
] as const satisfies TestCases<FluggastrechtContext>;

export const testCasesFluggastrechteFormularProzessfuehrung = {
  machine,
  cases,
};
