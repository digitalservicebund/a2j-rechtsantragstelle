import type { createMachine } from "xstate";
import { getStateValueString } from "~/services/flow/getStateValueString";

export function getEnabledSteps<T>({
  machine,
  context,
  transitionType,
  steps,
}: {
  machine: ReturnType<typeof createMachine<T>>;
  context: T;
  transitionType: "SUBMIT" | "BACK";
  steps: Readonly<Array<string>>;
}) {
  return [
    steps[0],
    ...steps
      .slice(0, -1)
      .map((step) =>
        getStateValueString(
          machine.transition(step, transitionType, context).value,
        ),
      ),
  ];
}
