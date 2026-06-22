import { type FlowId } from "~/domains/flowIds";
import { getSessionManager } from "~/services/session.server";
import { addPageDataToUserData } from "../pageData";
import { createFlowSession } from "../newFlowEngine/createFlowSession";
import { type CompiledFlow } from "../newFlowEngine/compileFlow";
import { type PageConfigMap } from "../newFlowEngine/types";
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

const findFirstPageInSection = (
  compiledFlow: CompiledFlow<PageConfigMap>,
  userData: Parameters<typeof createFlowSession>[1],
  sectionPrefix: string,
): string | undefined => {
  try {
    const session = createFlowSession(
      compiledFlow,
      userData,
      compiledFlow.initialPath,
    );
    return session.simulationKeys
      .map((k) => compiledFlow.getPathFromNodeKey(k))
      .find((path) => path?.startsWith(`${sectionPrefix}/`));
  } catch {
    return undefined;
  }
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
    // stepId may be a section-prefix URL (e.g. "/gericht-pruefen/forderung")
    // with no corresponding page. Find the first matching page and redirect.
    const firstPageInSection = findFirstPageInSection(
      compiledStaticFlow,
      fullUserData as Parameters<typeof createFlowSession>[1],
      stepId,
    );
    const redirectPath = firstPageInSection ?? compiledStaticFlow.initialPath;
    return Result.err({ redirectTo: flowId + redirectPath });
  }
};
