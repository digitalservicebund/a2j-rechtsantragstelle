import type { FlowId } from "~/flows/flowIds";
import type { Flow } from "~/flows/flows.server";
import { type CookieHeader, getSessionData } from ".";
import { buildFlowController } from "../flow/server/buildFlowController";

export type FlowTransitionConfig = {
  targetFlowId: FlowId;
  sourceFlowId: FlowId;
  eligibleSourcePages: string[];
};

export async function validateFlowTransition(
  flows: Record<FlowId, Flow>,
  flowId: FlowId,
  cookieHeader: CookieHeader,
  config: FlowTransitionConfig,
): Promise<boolean> {
  const { targetFlowId, sourceFlowId, eligibleSourcePages } = config;

  if (flowId !== targetFlowId) {
    return false;
  }

  if (eligibleSourcePages.length === 0) {
    throw Error("This property should not be empty");
  }

  const { userData } = await getSessionData(sourceFlowId, cookieHeader);

  const fluggastrechteVorabcheckController = buildFlowController({
    config: flows[sourceFlowId].config,
    data: userData,
    guards: flows[sourceFlowId].guards,
  });

  return eligibleSourcePages.some((page) =>
    fluggastrechteVorabcheckController.isReachable(page),
  );
}
