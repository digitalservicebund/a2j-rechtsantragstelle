import _ from "lodash";
import type { FlowId } from "~/flows/flowIds";
import type { Flow } from "~/flows/flows.server";
import { type CookieHeader, getSessionData } from ".";
import { buildFlowController } from "../flow/server/buildFlowController";

export type FlowTransitionConfig = {
  targetFlowId: FlowId;
  sourceFlowId: FlowId;
  eligibleSourcePages: string[];
};

type FlowTransitionResult = {
  isEligible: boolean;
  redirectTo?: string;
};

export async function validateFlowTransition(
  flows: Record<FlowId, Flow>,
  flowId: FlowId,
  cookieHeader: CookieHeader,
  config: FlowTransitionConfig,
): Promise<FlowTransitionResult> {
  const { targetFlowId, sourceFlowId, eligibleSourcePages } = config;

  // Ignore validation and skip redirection if the user is not in the target flow.
  if (flowId !== targetFlowId) {
    return { isEligible: false };
  }

  if (_.isEmpty(eligibleSourcePages)) {
    throw Error("This property should not be empty");
  }

  const { userData } = await getSessionData(sourceFlowId, cookieHeader);

  const fluggastrechteVorabcheckController = buildFlowController({
    config: flows[sourceFlowId].config,
    data: userData,
    guards: flows[sourceFlowId].guards,
  });

  const isEligibleForTransition = eligibleSourcePages.some((page) =>
    fluggastrechteVorabcheckController.isReachable(page),
  );

  return isEligibleForTransition
    ? { isEligible: true }
    : { isEligible: false, redirectTo: sourceFlowId };
}
