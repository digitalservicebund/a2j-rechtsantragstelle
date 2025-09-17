import { type FlowId } from "~/domains/flowIds";
import {
  type CookieHeader,
  getSessionManager,
} from "~/services/session.server";

export const userVisitedValidationPageKey = "userVisitedValidationPage";

export const setUserVisitedValidationPage = async (
  triggerValidation: boolean | undefined,
  flowId: FlowId,
  cookieHeader: CookieHeader,
) => {
  if (!triggerValidation) {
    return;
  }

  const { getSession, commitSession } = getSessionManager(flowId);
  const session = await getSession(cookieHeader);
  session.set(userVisitedValidationPageKey, true);
  await commitSession(session);
};
