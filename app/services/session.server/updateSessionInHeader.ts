import type { FlowId } from "~/flows/flowIds";
import { lastStepKey } from "~/services/flow/constants";
import { createSessionWithCsrf } from "~/services/security/csrf/createSessionWithCsrf.server";
import {
  type CookieHeader,
  getSessionManager,
} from "~/services/session.server/index";

export const updateMainSession = async ({
  cookieHeader,
  flowId,
  stepId,
}: {
  cookieHeader: CookieHeader;
  flowId: FlowId;
  stepId: string;
}) => {
  const { session, csrf } = await createSessionWithCsrf(cookieHeader);

  // update session with last valid step
  session.set(lastStepKey, { [flowId]: stepId });

  const sessionManager = getSessionManager("main");
  const headers = { "Set-Cookie": await sessionManager.commitSession(session) };
  return { headers, csrf };
};
