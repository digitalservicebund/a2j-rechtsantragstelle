import { type FlowId } from "~/domains/flowIds";
import {
  type CookieHeader,
  getSessionManager,
} from "~/services/session.server";

export const userVisitedValidationPageKey = "userVisitedValidationPage";

export const setUserVisitedValidationPage = async (
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => {
  const { getSession, commitSession } = getSessionManager(flowId);
  const session = await getSession(cookieHeader);
  session.set(userVisitedValidationPageKey, true);
  await commitSession(session);
};
