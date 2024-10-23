import _ from "lodash";
import type { FlowId } from "~/flows/flowIds";
import type { Flow } from "~/flows/flows.server";
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

export async function validateFlowTransition(
  flows: Record<FlowId, Flow>,
  cookieHeader: CookieHeader,
  config: FlowTransitionConfig,
): Promise<FlowTransitionResult> {
  const { sourceFlowId, eligibleSourcePages } = config;

  if (_.isEmpty(eligibleSourcePages)) {
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
