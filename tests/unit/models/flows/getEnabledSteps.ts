import { parsePathname, type Context } from "~/models/flows/contexts";
import type { FlowStateMachine } from "~/services/flow/server/buildFlowController";
import { transitionDestinations } from "~/services/flow/server/buildFlowController";

export function getEnabledSteps({
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
  const initialStep = steps[0];
  const reachableSteps = steps.slice(0, -1).map((step) => {
    const transDest = transitionDestinations(
      machine,
      step,
      transitionType,
      context,
    );
    const { stepId } = parsePathname(transDest?.at(0) ?? "");
    return stepId;
  });
  return [initialStep, ...reachableSteps];
}
