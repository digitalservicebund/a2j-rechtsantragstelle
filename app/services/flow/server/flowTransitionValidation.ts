import isEmpty from "lodash/isEmpty";
import type { FlowId } from "~/domains/flowIds";
import type { Flow } from "~/domains/flows.server";
import { buildFlowController } from "./buildFlowController";
import { type CookieHeader, getSessionData } from "../../session.server";

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

export function getAsyncFlowActions(currentFlow: Flow) {
  return "asyncFlowActions" in currentFlow
    ? currentFlow.asyncFlowActions
    : undefined;
}

export async function validateFlowTransition(
  flows: Record<FlowId, Flow>,
  cookieHeader: CookieHeader,
  config: FlowTransitionConfig,
): Promise<FlowTransitionResult> {
  const { sourceFlowId, eligibleSourcePages } = config;

  if (isEmpty(eligibleSourcePages)) {
    throw Error("This property should not be empty");
  }

  const { userData } = await getSessionData(sourceFlowId, cookieHeader);

  const sourceFlowController = buildFlowController({
    config: flows[sourceFlowId].config,
    data: userData,
    guards: flows[sourceFlowId].guards,
  });

  const isEligibleForTransition = eligibleSourcePages.some((page) =>
    sourceFlowController.isReachable(page),
  );

  return isEligibleForTransition
    ? { isEligible: true }
    : { isEligible: false, redirectTo: sourceFlowId };
}
