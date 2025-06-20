import { addPageDataToUserData } from "~/services/flow/pageData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { type CookieHeader, getSessionData } from "~/services/session.server";
import { getPageAndFlowDataFromPathname } from "./getPageAndFlowDataFromPathname";

export const getPrunedUserDataFromPathname = async (
  pathname: string,
  cookieHeader: CookieHeader,
) => {
  const { flowId, arrayIndexes } = getPageAndFlowDataFromPathname(pathname);
  const { userData } = await getSessionData(flowId, cookieHeader);

  const { prunedData: prunedUserData, validFlowPaths } =
    await pruneIrrelevantData(userData, flowId);
  const userDataWithPageData = addPageDataToUserData(prunedUserData, {
    arrayIndexes,
  });
  return { userDataWithPageData, validFlowPaths };
};
