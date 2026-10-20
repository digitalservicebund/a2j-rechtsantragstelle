import isEmpty from "lodash/isEmpty";
import type { FlowId } from "~/domains/flowIds";
import { type CookieHeader, getSessionData } from "../../session.server";
import { type Flow } from "~/domains/flows.server";
import { createFlowSession } from "~/services/flow/flowEngine/createFlowSession";

export type FlowTransitionConfig = {
  sourceFlowId: FlowId;
  eligibleSourcePages: string[];
};

type FlowTransitionResult = {
  isEligible: boolean;
  redirectTo?: string;
};

export function getFlowTransitionConfig(currentFlow: Flow) {
  return "flowTransitionConfig" in currentFlow
    ? currentFlow.flowTransitionConfig
    : undefined;
}

export async function validateFlowTransition(
  sourceFlow: Flow,
  cookieHeader: CookieHeader,
  config: FlowTransitionConfig,
): Promise<FlowTransitionResult> {
  const { sourceFlowId, eligibleSourcePages } = config;

  if (isEmpty(eligibleSourcePages)) {
    throw new Error("This property should not be empty");
  }

  const sourceFlowConfig = sourceFlow.config;

  if (!sourceFlowConfig) {
    throw new Error(
      `Source flow ${sourceFlowId} does not have a config, which is required for flow transitions.`,
    );
  }

  const sourceFlowSession = createFlowSession(
    sourceFlowConfig,
    await getSessionData(sourceFlowId, cookieHeader),
    sourceFlowConfig.initialPath,
  );

  const isEligibleForTransition = eligibleSourcePages.some((page) =>
    sourceFlowSession.isReachable(page),
  );

  return isEligibleForTransition
    ? { isEligible: true }
    : { isEligible: false, redirectTo: sourceFlowId };
}
