import { Result } from "true-myth";
import { emailCaptureConsentName } from "~/components/content/emailCapture/emailCaptureHelpers";
import { type FlowId } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import { userVisitedValidationPageKey } from "~/services/flow/server/setUserVisitedValidationPage";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { type UserDataWithPageData } from "../pageData";
import { type FeatureFlag } from "~/services/isFeatureFlagEnabled.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";
import { type createFlowSession } from "../newFlowEngine/createFlowSession";
import { validateStepIdFlowNewEngine } from "./validateStepIdFlowNewEngine";
import { type ValidFlowPagesType } from "~/components/hooks/formFlowContext";
import { getSessionAndEngine } from "./getSessionAndEngine";

const buildValidFlowPaths = (
  flowSessionEngine: ReturnType<typeof createFlowSession>,
): ValidFlowPagesType => {
  return Object.fromEntries(
    flowSessionEngine.paths.map((path) => [
      path,
      { isArrayPage: flowSessionEngine.isArrayPage(path) },
    ]),
  ) as ValidFlowPagesType;
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

  const newEngineConfig =
    "newEngineConfig" in currentFlow ? currentFlow.newEngineConfig : undefined;

  const sessionEngineResult = await getSessionAndEngine(
    flowId,
    newEngineConfig,
    cookieHeader ?? "",
    stepId,
    arrayIndexes,
  );

  if (sessionEngineResult.isErr) {
    return Result.err({ redirectTo: sessionEngineResult.error.redirectTo });
  }

  const { flowSession, flowSessionEngine } = sessionEngineResult.value;

  const validationFlowResult = validateStepIdFlowNewEngine(
    flowId,
    stepId,
    flowSessionEngine,
    url,
  );

  if (validationFlowResult.isErr) {
    return Result.err({ redirectTo: validationFlowResult.error.redirectTo });
  }

  return Result.ok({
    userData: flowSessionEngine.prunedUserData as UserDataWithPageData, // NOSONAR
    flow: {
      id: flowId,
      validFlowPaths: buildValidFlowPaths(flowSessionEngine),
      userVisitedValidationPage: flowSession.get(userVisitedValidationPageKey),
      useStepper:
        "useStepper" in currentFlow && currentFlow.useStepper !== undefined
          ? currentFlow.useStepper
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
