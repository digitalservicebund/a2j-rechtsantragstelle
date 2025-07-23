import type { Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";
import { getPrunedUserDataFromPathname } from "~/services/flow/getPrunedUserDataFromPathname";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";

export const postValidationFlowAction = async (
  request: Request,
  newUserData: UserData,
) => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const { userDataWithPageData } = await getPrunedUserDataFromPathname(
    pathname,
    cookieHeader,
  );
  const { stepId, currentFlow } = getPageAndFlowDataFromPathname(pathname);
  const { asyncFlowActions } = currentFlow as Flow;
  if (asyncFlowActions && stepId in asyncFlowActions)
    await asyncFlowActions[stepId](request, {
      ...userDataWithPageData,
      ...newUserData,
    });
};
