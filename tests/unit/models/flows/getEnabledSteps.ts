import type { createMachine } from "xstate";

export function getEnabledSteps<T>({
  machine,
  context,
  transitionType,
  steps,
}: {
  machine: ReturnType<typeof createMachine<T>>;
  context: T;
  transitionType: "SUBMIT" | "BACK";
  steps: string[];
}) {
  return [
    steps[0],
    ...steps
      .slice(0, -1)
      .map((step) =>
        String(machine.transition(step, transitionType, context).value)
      ),
  ];
}
