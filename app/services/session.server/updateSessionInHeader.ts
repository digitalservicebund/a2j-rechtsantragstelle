import type { FlowId } from "~/domains/flowIds";
import { lastStepKey } from "~/services/flow/constants";
import { getCSRFFromSession } from "~/services/security/csrf/getCSRFFromSession.server";
import {
  type CookieHeader,
  getSessionManager,
} from "~/services/session.server/index";

export const updateLastVisitedStep = async ({
  cookieHeader,
  flowId,
  stepId,
}: {
  cookieHeader: CookieHeader;
  flowId: FlowId;
  stepId: string;
}) => {
  const sessionManager = getSessionManager("main");
  const session = await sessionManager.getSession(cookieHeader);
  session.set(lastStepKey, { [flowId]: stepId });
  const headers = await sessionManager.commitSession(session);

  return { headers, csrf: getCSRFFromSession(session) };
};
