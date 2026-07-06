import { type FlowId } from "~/domains/flowIds";
import { getSessionManager } from "~/services/session.server";
import { addPageDataToUserData } from "../pageData";
import {
  createFlowSession,
  type FlowSession,
} from "../newFlowEngine/createFlowSession";
import { type Flow } from "~/domains/flows.server";
import { Result } from "true-myth";
import type { Session, SessionData } from "react-router";
import { type PageConfigMap } from "../newFlowEngine/types";

type OkResult = {
  flowSession: Session<SessionData, SessionData>;
  flowSessionEngine: FlowSession<PageConfigMap>;
};

type ErrorResult = {
  redirectTo: string;
};

export const getSessionAndEngine = async (
  flowId: FlowId,
  newEngineConfig: Flow["newEngineConfig"],
  cookieHeader: string,
  stepId: string,
  arrayIndexes?: number[],
): Promise<Result<OkResult, ErrorResult>> => {
  // TODO - Remove this later, once we migrated all the flows to the new engine
  if (!newEngineConfig) {
    throw new Response(null, { status: 404 });
  }

  const flowSession = await getSessionManager(flowId).getSession(cookieHeader);

  const fullUserData = addPageDataToUserData(flowSession.data, {
    arrayIndexes,
  });

  try {
    const flowSessionEnginePrunedData = createFlowSession(
      newEngineConfig,
      fullUserData as Parameters<typeof createFlowSession>[1],
      stepId,
    );

    // We need to create a new flow session with the pruned user data to get the next step id, because the next step id is determined by the flow engine based on the current state of the user data.
    const prunedUserDataPruned = addPageDataToUserData(
      flowSessionEnginePrunedData.prunedUserData,
      {
        arrayIndexes,
      },
    );
    const flowSessionEngine = createFlowSession(
      newEngineConfig,
      prunedUserDataPruned,
      stepId,
    );

    return Result.ok({ flowSession, flowSessionEngine });
  } catch {
    // In case the engine throws an error during creation, we want to catch it and redirect the user to the initial page of the flow, instead of showing an error page.
    return Result.err({ redirectTo: flowId + newEngineConfig.initialPath });
  }
};
