import { Result, type Unit } from "true-myth";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";
import { type FlowSession } from "../newFlowEngine/createFlowSession";
import { type PageConfigMap } from "../newFlowEngine/types";
import { type CompiledFlow } from "~/services/flow/newFlowEngine/compileFlow";
import {
  getFlowTransitionConfig,
  validateFlowTransition,
} from "~/services/flow/newFlowEngine/flowTransitionValidationNewEngine";
import { flows } from "~/domains/flows.server";
import { type FlowId } from "~/domains/flowIds";

export const validateStepIdFlowNewEngine = async (
  flowId: FlowId,
  stepId: string,
  searchParams: URLSearchParams,
  cookieHeader: string | null,
  currentFlowSessionEngine: FlowSession<PageConfigMap>,
  currentFlow: CompiledFlow<PageConfigMap>,
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
