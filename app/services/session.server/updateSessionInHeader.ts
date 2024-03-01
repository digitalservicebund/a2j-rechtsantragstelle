import { updateSessionWithCsrfToken } from "~/services/security/csrf.server";
import { lastStepKey } from "~/services/flow/constants";
import { getSessionForContext } from "~/services/session.server/index";
import type { FlowId } from "~/models/flows/contexts";

export const updateSessionInHeader = async ({
  request,
  flowId,
  stepId,
}: {
  request: Request;
  flowId: FlowId;
  stepId: string;
}) => {
  const { session, csrf } = await updateSessionWithCsrfToken(request);

  // update session with last valid step
  session.set(lastStepKey, { [flowId]: stepId });

  const sessionContext = getSessionForContext("main");
  const headers = { "Set-Cookie": await sessionContext.commitSession(session) };

  return { headers, csrf };
};
