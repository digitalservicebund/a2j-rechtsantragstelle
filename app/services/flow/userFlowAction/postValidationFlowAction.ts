import type { Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import type { Session } from "react-router";

export const postValidationFlowAction = async (
  request: Request,
  userData: UserData,
  flowSession: Session,
) => {
  const { pathname } = new URL(request.url);
  const { stepId, currentFlow } = getPageAndFlowDataFromPathname(pathname);
  const { asyncFlowActions } = currentFlow as Flow;
  if (asyncFlowActions && stepId in asyncFlowActions)
    await asyncFlowActions[stepId](request, userData, flowSession);
};
