import type { FlowId } from "~/domains/flowIds";
import { lastStepKey } from "~/services/flow/constants";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
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
  const sessionManager = getSessionManager(flowId);
  const session = await sessionManager.getSession(cookieHeader);
  session.set(lastStepKey, { [flowId]: stepId });
  const headers = await sessionManager.commitSession(session);

  const mainSession = await getSessionManager("main").getSession(cookieHeader);
  const csrf = mainSession.get(CSRFKey);
  return { headers, csrf };
};
