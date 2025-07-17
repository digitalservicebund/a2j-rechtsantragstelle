import { type Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";

export async function executeAsyncFlowActionByStepId(
  currentFlow: Flow,
  stepId: string,
  request: Request,
  userData: UserData,
) {
  if (currentFlow.asyncFlowActions && stepId in currentFlow.asyncFlowActions) {
    await currentFlow.asyncFlowActions[stepId](request, userData);
  }
}
