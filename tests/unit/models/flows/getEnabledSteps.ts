import type { createMachine } from "xstate";

export function getEnabledSteps<T>(
  machine: ReturnType<typeof createMachine<T>>,
  context: T,
  transitionType: "SUBMIT" | "BACK",
  firstStep: string
) {
  let returnedSteps = [firstStep];
  while (true) {
    const nextStep = machine.transition(
      returnedSteps.at(-1),
      transitionType,
      context
    );
    if (nextStep.value == returnedSteps.at(-1)) break;
    returnedSteps.push(String(nextStep.value));
  }
  return returnedSteps;
}
