import { type FlowId } from "~/domains/flowIds";
import { getSessionManager } from "~/services/session.server";
import { addPageDataToUserData } from "../pageData";
import { createFlowSession } from "../newFlowEngine/createFlowSession";
import { type Flow } from "~/domains/flows.server";
import { Result } from "true-myth";
import type { Session, SessionData } from "react-router";

type OkResult = {
  flowSession: Session<SessionData, SessionData>;
  flowSessionEngine: ReturnType<typeof createFlowSession>;
};

type ErrorResult = {
  redirectTo: string;
};

export const getSessionAndEngine = async (
  flowId: FlowId,
  currentFlow: Flow,
  cookieHeader: string,
  stepId: string,
  arrayIndexes?: number[],
): Promise<Result<OkResult, ErrorResult>> => {
  const compiledStaticFlow =
    "newEngineConfig" in currentFlow ? currentFlow.newEngineConfig : undefined;

  // TODO - Remove this later, once we migrated all the flows to the new engine
  if (!compiledStaticFlow) {
    throw new Response(null, { status: 404 });
  }

  const flowSession = await getSessionManager(flowId).getSession(cookieHeader);

  const fullUserData = addPageDataToUserData(flowSession.data, {
    arrayIndexes,
  });

  try {
    const flowSessionEngine = createFlowSession(
      compiledStaticFlow,
      fullUserData as Parameters<typeof createFlowSession>[1],
      stepId,
    );
    return Result.ok({ flowSession, flowSessionEngine });
  } catch {
    // In case the engine throws an error during creation, we want to catch it and redirect the user to the initial page of the flow, instead of showing an error page.
    return Result.err({ redirectTo: flowId + compiledStaticFlow.initialPath });
  }
};
