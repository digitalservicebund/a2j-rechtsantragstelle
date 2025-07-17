import { type UserData } from "~/domains/userData";
import { executeAsyncFlowActionByStepId } from "~/services/flow/server/executeAsyncFlowActionByStepId";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";

export const postValidationFormUserData = async (
  request: Request,
  userData: UserData,
) => {
  const { pathname } = new URL(request.url);
  const { currentFlow, stepId } = getPageAndFlowDataFromPathname(pathname);
  await executeAsyncFlowActionByStepId(currentFlow, stepId, request, userData);
};
