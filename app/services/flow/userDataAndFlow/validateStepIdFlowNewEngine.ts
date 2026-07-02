import { Result, type Unit } from "true-myth";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";
import { type FlowSession } from "../newFlowEngine/createFlowSession";
import { type FlowId } from "~/domains/flowIds";
import { type PageConfigMap } from "../newFlowEngine/types";

export const validateStepIdFlowNewEngine = (
  flowId: FlowId,
  stepId: string,
  flowSessionEngine: FlowSession<PageConfigMap>,
  url: URL,
): Result<Unit, { redirectTo: string }> => {
  const { searchParams } = url;

  if (
    !flowSessionEngine.isReachable(stepId) &&
    !skipFlowParamAllowedAndEnabled(searchParams)
  )
    return Result.err({
      redirectTo: flowId + flowSessionEngine.initialPath,
    });

  return Result.ok();
};
