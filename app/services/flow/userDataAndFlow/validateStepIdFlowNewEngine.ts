import { Result, type Unit } from "true-myth";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";
import { type createFlowSession } from "../newFlowEngine/createFlowSession";

export const validateStepIdFlowNewEngine = async (
  stepId: string,
  flowSessionEngine: ReturnType<typeof createFlowSession>,
  url: URL,
): Promise<Result<Unit, { redirectTo: string }>> => {
  const { searchParams } = url;

  if (
    !flowSessionEngine.isReachable(stepId) &&
    !skipFlowParamAllowedAndEnabled(searchParams)
  )
    return Result.err({
      redirectTo: flowSessionEngine.initialPath,
    });

  return Result.ok();
};
