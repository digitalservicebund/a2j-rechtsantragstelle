import { Flow } from "~/domains/flows.server";

function getAsyncFlowActions(currentFlow: Flow) {
  return "asyncFlowActions" in currentFlow
    ? currentFlow.asyncFlowActions
    : undefined;
}

export async function executeAsyncFlowActionByStepId(
  currentFlow: Flow,
  stepId: string,
  request: Request,
) {
  const asyncFlowActions = getAsyncFlowActions(currentFlow);

  if (asyncFlowActions?.[stepId]) {
    await asyncFlowActions[stepId](request);
  }
}
