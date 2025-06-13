import { Result } from "true-myth";
import { type ValidFlowPagesType } from "~/components/form/formFlowContext";
import { type FlowId, parsePathname } from "~/domains/flowIds";
import { flows, type Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import {
  getFlowTransitionConfig,
  validateFlowTransition,
} from "~/services/flow/server/flowTransitionValidation";
import { skipFlowParamAllowedAndEnabled } from "~/services/params";
import { getSessionData } from "~/services/session.server";

type OkResult = {
  userData: UserData & {
    pageData: {
      arrayIndexes: number[];
    };
  };
  flow: {
    current: Flow;
    id: FlowId;
    controller: ReturnType<typeof buildFlowController>;
    validFlowPaths: ValidFlowPagesType;
  };
  page: {
    stepId: string;
    arrayIndexes: number[];
    pathname: string;
  };
};

type ErrorResult = {
  redirectTo: string;
};

export const getUserAndFlow = async (
  request: Request,
): Promise<Result<OkResult, ErrorResult>> => {
  const { pathname, searchParams } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");
  const { userData } = await getSessionData(flowId, cookieHeader);

  const currentFlow = flows[flowId];
  const { prunedData: prunedUserData, validFlowPaths } =
    await pruneIrrelevantData(userData, flowId);
  const userDataWithPageData = addPageDataToUserData(prunedUserData, {
    arrayIndexes,
  });
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userDataWithPageData,
    guards: currentFlow.guards,
  });

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

  return Result.ok({
    userData: userDataWithPageData,
    flow: {
      id: flowId,
      current: currentFlow,
      controller: flowController,
      validFlowPaths,
    },
    page: {
      stepId,
      arrayIndexes: arrayIndexes ?? [],
      pathname,
      cookieHeader,
    },
  });
};
