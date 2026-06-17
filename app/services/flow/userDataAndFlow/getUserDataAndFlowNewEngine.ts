import { Result } from "true-myth";
import { emailCaptureConsentName } from "~/components/content/emailCapture/emailCaptureHelpers";
import { type FlowId } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import { userVisitedValidationPageKey } from "~/services/flow/server/setUserVisitedValidationPage";
import { getSessionManager } from "~/services/session.server";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { addPageDataToUserData, type UserDataWithPageData } from "../pageData";
import { type FeatureFlag } from "~/services/isFeatureFlagEnabled.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
import { type Flow } from "~/domains/flows.server";
import { type CompiledFlow } from "../newFlowEngine/compileFlow";
import { createFlowSession } from "../newFlowEngine/createFlowSession";
import { validateStepIdFlowNewEngine } from "./validateStepIdFlowNewEngine";
import { type ValidFlowPagesType } from "~/components/hooks/formFlowContext";

const hasNewEngineConfig = (
  flow: Flow,
): flow is Flow<CompiledFlow<any>> & { newEngineConfig: CompiledFlow<any> } =>
  flow.newEngineConfig !== undefined;

const buildValidFlowPaths = (
  flowSessionEngine: ReturnType<typeof createFlowSession>,
): ValidFlowPagesType => {
  const validFlowPaths: ValidFlowPagesType = {};

  for (const path of flowSessionEngine.path) {
    validFlowPaths[path] = {
      isArrayPage: flowSessionEngine.isArrayPage(path),
    };
  }
  return validFlowPaths;
};

type OkResult = {
  userData: UserDataWithPageData;
  flow: {
    id: FlowId;
    validFlowPaths: ValidFlowPagesType;
    userVisitedValidationPage?: boolean;
    useStepper: boolean;
    flowSessionEngine: ReturnType<typeof createFlowSession>;
  };
  page: {
    stepId: string;
    arrayIndexes?: number[];
  };
  emailCaptureConsent: boolean | undefined;
  migration: {
    userData: UserData | undefined;
    sortedFields?: string[];
    buttonUrl?: string;
  };
};

type ErrorResult = {
  redirectTo: string;
};

const flowIdFeatureFlag: Partial<Record<FlowId, FeatureFlag>> = {
  "/nachlass/erbausschlagung/anfrage": "showErbausschlagungFlow",
} as const;

export const getUserDataAndFlowNewEngine = async (
  request: Request,
  url: URL,
): Promise<Result<OkResult, ErrorResult>> => {
  const { pathname } = url;
  const cookieHeader = request.headers.get("Cookie");

  const { flowId, stepId, arrayIndexes, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const featureFlag = flowIdFeatureFlag[flowId];

  if (featureFlag) {
    await throw404IfFeatureFlagDisabled(featureFlag);
  }

  const compiledStaticFlow = hasNewEngineConfig(currentFlow)
    ? currentFlow.newEngineConfig
    : undefined;

  if (!compiledStaticFlow) {
    throw new Response(null, { status: 404 });
  }

  const flowSession = await getSessionManager(flowId).getSession(cookieHeader);

  const fullUserData = addPageDataToUserData(flowSession.data, {
    arrayIndexes,
  });

  const flowSessionEngine = createFlowSession(
    compiledStaticFlow,
    fullUserData as Parameters<typeof createFlowSession>[1],
    stepId,
  );

  const validationFlowResult = await validateStepIdFlowNewEngine(
    stepId,
    flowSessionEngine,
    url,
  );

  if (validationFlowResult.isErr) {
    return Result.err({ redirectTo: validationFlowResult.error.redirectTo });
  }

  return Result.ok({
    userData: flowSessionEngine.prunedUserData as UserDataWithPageData,
    flow: {
      id: flowId,
      validFlowPaths: buildValidFlowPaths(flowSessionEngine),
      userVisitedValidationPage: flowSession.get(userVisitedValidationPageKey),
      useStepper:
        "useStepper" in currentFlow
          ? ((currentFlow as Flow).useStepper ?? false)
          : false,
      flowSessionEngine,
    },
    page: {
      stepId,
      arrayIndexes,
    },
    emailCaptureConsent: flowSession.get(emailCaptureConsentName),
    migration: {
      userData: {},
      sortedFields:
        "migration" in currentFlow
          ? currentFlow.migration?.sortedFields
          : undefined,
      buttonUrl:
        "migration" in currentFlow
          ? currentFlow.migration?.buttonUrl
          : undefined,
    },
  });
};
