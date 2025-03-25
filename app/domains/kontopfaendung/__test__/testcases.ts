import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { kontopfaendungWegweiserContext } from "~/domains/kontopfaendung/wegweiser/context";
import { kontopfaendungWegweiserXstateConfig } from "~/domains/kontopfaendung/wegweiser/xStateConfig";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";

const cases = [
  [
    { hasKontopfaendung: "nein" },
    ["/start", "/kontopfaendung", "/ergebnisseite"],
  ],
  [
    { hasKontopfaendung: "ja", euroSchwelle: "nein" },
    [
      "/start",
      "/kontopfaendung",
      "/p-konto",
      "/glaeubiger",
      "/euro-schwelle",
      "/ergebnisseite",
    ],
  ],
] as const satisfies TestCases<kontopfaendungWegweiserContext>;

const machine: FlowStateMachine = createMachine(
  kontopfaendungWegweiserXstateConfig,
);
export const testCasesKontopfaendungWegweiser = { machine, cases };
