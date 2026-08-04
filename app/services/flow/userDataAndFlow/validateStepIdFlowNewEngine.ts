import { Result, type Unit } from "true-myth";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";
import { type FlowSession } from "../newFlowEngine/createFlowSession";
import { type PageConfigMap } from "../newFlowEngine/types";
import { validateFlowTransition } from "~/services/flow/newFlowEngine/flowTransitionValidationNewEngine";
import { type Flow, flows } from "~/domains/flows.server";
import { type FlowId } from "~/domains/flowIds";
import { getFlowTransitionConfig } from "~/services/flow/server/flowTransitionValidation";

export const validateStepIdFlowNewEngine = async (
  flowId: FlowId,
  stepId: string,
  searchParams: URLSearchParams,
  cookieHeader: string | null,
  currentFlowSessionEngine: FlowSession<PageConfigMap>,
  currentFlow: Flow,
): Promise<Result<Unit, { redirectTo: string }>> => {
  if (
    !currentFlowSessionEngine.isReachable(stepId) &&
    !skipFlowParamAllowedAndEnabled(searchParams)
  )
    return Result.err({
      redirectTo: flowId + currentFlowSessionEngine.initialPath,
    });

  const flowTransitionConfig = getFlowTransitionConfig(currentFlow);
  if (flowTransitionConfig) {
    const eligibilityResult = await validateFlowTransition(
      flows[flowTransitionConfig.sourceFlowId],
      cookieHeader,
      flowTransitionConfig,
    );

    if (!eligibilityResult.isEligible && eligibilityResult.redirectTo) {
      return Result.err({
        redirectTo: eligibilityResult.redirectTo,
      });
    }
  }
  return Result.ok();
};
