import { addPageDataToUserData } from "~/services/flow/pageData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { type CookieHeader, getSessionData } from "~/services/session.server";
import { parsePathname } from "~/domains/flowIds";

export const getPrunedUserDataFromPathname = async (
  pathname: string,
  cookieHeader: CookieHeader,
) => {
  const { flowId, arrayIndexes } = parsePathname(pathname);
  const { userData } = await getSessionData(flowId, cookieHeader);
  const prunedOut = await pruneIrrelevantData(userData, flowId);
  const userDataWithPageData = addPageDataToUserData(prunedOut.prunedData, {
    arrayIndexes,
  });
  return { userDataWithPageData, validFlowPaths: prunedOut.validFlowPaths };
};
