import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { fluggastrechtFlow } from "~/domains/fluggastrechte/formular";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import type { FlowStateMachine } from "~/services/flow/server/types";
import { fluggastrechteGuards } from "../../guards";

const machine: FlowStateMachine = createMachine(
  { ...fluggastrechtFlow.config, context: {} },
  { guards: fluggastrechteGuards },
);

const cases = [
  [
    {
      hasZeugen: "yes",
      versaeumnisurteil: "yes",
      videoverhandlung: "yes",
    },
    [
      "/prozessfuehrung/zeugen",
      "/prozessfuehrung/videoverhandlung",
      "/prozessfuehrung/versaeumnisurteil",
      "/prozessfuehrung/zahlung-nach-klageeinreichung",
      "/zusammenfassung/start",
      "/abgabe/start",
    ],
  ],
] as const satisfies TestCases<FluggastrechteUserData>;

export const testCasesFluggastrechteFormularProzessfuehrung = {
  machine,
  cases,
};
