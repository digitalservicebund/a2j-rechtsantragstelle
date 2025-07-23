import type { Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";

export const postValidationFlowAction = async (
  request: Request,
  userData: UserData,
) => {
  const { pathname } = new URL(request.url);
  const { stepId, currentFlow } = getPageAndFlowDataFromPathname(pathname);
  const { asyncFlowActions } = currentFlow as Flow;
  if (asyncFlowActions && stepId in asyncFlowActions)
    await asyncFlowActions[stepId](request, userData);
};
