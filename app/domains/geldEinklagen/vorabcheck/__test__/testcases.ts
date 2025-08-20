/* eslint sonarjs/no-duplicate-string: 0 */
import { createMachine } from "xstate";
import type { TestCases } from "~/domains/__test__/TestCases";
import { happyPathData } from "~/domains/geldEinklagen/vorabcheck/__test__/geldEinklagenVorabcheckData";
import type { GeldEinklagenVorabcheckUserData } from "~/domains/geldEinklagen/vorabcheck/userData";
import { geldEinklagenVorabcheckXstateConfig } from "~/domains/geldEinklagen/vorabcheck/xstateConfig";
import type { FlowStateMachine } from "~/services/flow/server/types";

const machine: FlowStateMachine = createMachine(
  { ...geldEinklagenVorabcheckXstateConfig, context: {} },
  { guards: {} },
);

const happyPathSteps = ["/start"];

const cases = [
  [{}, ["/start"]],
  [happyPathData, happyPathSteps],
] as const satisfies TestCases<GeldEinklagenVorabcheckUserData>;

export const testCasesGeldEinklagen = { machine, cases };
