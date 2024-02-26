import { parsePathname, type Context } from "~/models/flows/contexts";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { transitionDestination } from "~/services/flow/server/buildFlowController";

export function getEnabledSteps<T>({
  machine,
  context,
  transitionType,
  steps,
}: {
  machine: FlowStateMachine;
  context: Context;
  transitionType: "SUBMIT" | "BACK";
  steps: Readonly<Array<string>>;
}) {
  return [
    steps[0],
    ...steps.map((step) => {
      const { stepId } = parsePathname(
        transitionDestination(machine, step, transitionType, context) ?? "",
      );
      return stepId;
    }),

    // ...steps.slice(0, -1).map((step) => {
    //   getStateValueString(
    //     machine.transition(step, transitionType, context).value,
    //   );
    // }),
  ];
}
