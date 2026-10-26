import { type FlowId } from "~/domains/flowIds";
import { getSessionManager } from "~/services/session.server";
import { addPageDataToUserData } from "../pageData";
import {
  createFlowSession,
  type FlowSession,
} from "../flowEngine/createFlowSession";
import { type Flow } from "~/domains/flows.server";
import { Result } from "true-myth";
import type { Session, SessionData } from "react-router";
import { type PageConfigMap } from "../flowEngine/types";

type OkResult = {
  flowSession: Session<SessionData, SessionData>;
  flowSessionEngine: FlowSession<PageConfigMap>;
};

type ErrorResult = {
  redirectTo: string;
};

export const getSessionAndEngine = async (
  flowId: FlowId,
  config: Flow["config"],
  cookieHeader: string,
  stepId: string,
  arrayIndexes?: number[],
): Promise<Result<OkResult, ErrorResult>> => {
  if (!config) {
    throw new Response(null, { status: 404 });
  }

  const flowSession = await getSessionManager(flowId).getSession(cookieHeader);

  const fullUserData = addPageDataToUserData(flowSession.data, {
    arrayIndexes,
  });

  try {
    const flowSessionEngine = createFlowSession(
      config,
      fullUserData as Parameters<typeof createFlowSession>[1],
      stepId,
    );
    return Result.ok({ flowSession, flowSessionEngine });
  } catch {
    // In case the engine throws an error during creation, we want to catch it and redirect the user to the initial page of the flow, instead of showing an error page.
    return Result.err({ redirectTo: flowId + config.initialPath });
  }
};
