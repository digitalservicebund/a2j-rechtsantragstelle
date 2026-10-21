import type { Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import type { Session } from "react-router";

export const postValidationFlowAction = async (
  request: Request,
  userData: UserData,
  flowSession: Session,
  url: URL,
) => {
  const { pathname } = url;
  const { stepId, currentFlow } = getPageAndFlowDataFromPathname(pathname);
  const { posFlowActions } = currentFlow as Flow;
  if (posFlowActions && stepId in posFlowActions)
    await posFlowActions[stepId](request, userData, flowSession);
};
