import { type FlowId } from "~/domains/flowIds";
import { readyForValidationKey } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import {
  type CookieHeader,
  getSessionManager,
} from "~/services/session.server";

export const setUserVisitedValidationPage = async (
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => {
  const { getSession, commitSession } = getSessionManager(flowId);
  const session = await getSession(cookieHeader);
  session.set(readyForValidationKey, true);
  await commitSession(session);
};
