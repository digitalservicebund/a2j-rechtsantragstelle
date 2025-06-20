import { Result, type Unit } from "true-myth";
import { flows, type Flow } from "~/domains/flows.server";
import { type buildFlowController } from "~/services/flow/server/buildFlowController";
import {
  getFlowTransitionConfig,
  validateFlowTransition,
} from "~/services/flow/server/flowTransitionValidation";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";

export const validateStepIdFlow = async (
  stepId: string,
  request: Request,
  flowController: ReturnType<typeof buildFlowController>,
  currentFlow: Flow,
): Promise<Result<Unit, { redirectTo: string }>> => {
  const { searchParams } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");

  if (
    !flowController.isReachable(stepId) &&
    !skipFlowParamAllowedAndEnabled(searchParams)
  )
    return Result.err({
      redirectTo: flowController.getInitial(),
    });

  const flowTransitionConfig = getFlowTransitionConfig(currentFlow);
  if (flowTransitionConfig) {
    const eligibilityResult = await validateFlowTransition(
      flows,
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
