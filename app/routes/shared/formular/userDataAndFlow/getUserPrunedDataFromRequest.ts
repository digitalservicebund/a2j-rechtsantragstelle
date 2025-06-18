import { addPageDataToUserData } from "~/services/flow/pageData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { getSessionData } from "~/services/session.server";
import { getPageAndFlowDataFromRequest } from "./getPageAndFlowDataFromRequest";

export const getUserPrunedDataFromRequest = async (request: Request) => {
  const { flowId, arrayIndexes } = getPageAndFlowDataFromRequest(request);
  const cookieHeader = request.headers.get("Cookie");
  const { userData } = await getSessionData(flowId, cookieHeader);

  const { prunedData: prunedUserData, validFlowPaths } =
    await pruneIrrelevantData(userData, flowId);
  const userDataWithPageData = addPageDataToUserData(prunedUserData, {
    arrayIndexes,
  });
  return { userDataWithPageData, validFlowPaths };
};
