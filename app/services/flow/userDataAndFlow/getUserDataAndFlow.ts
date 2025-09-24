import { Result } from "true-myth";
import { emailCaptureConsentName } from "~/components/content/emailCapture/emailCaptureHelpers";
import { type ValidFlowPagesType } from "~/components/formFlowContext";
import { type FlowId } from "~/domains/flowIds";
import { type UserData } from "~/domains/userData";
import { userVisitedValidationPageKey } from "~/services/flow/formular/contentData/setUserVisitedValidationPage";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getSessionManager } from "~/services/session.server";
import { getMigrationData } from "~/services/session.server/getMigrationData";
import { validateStepIdFlow } from "./validateStepIdFlow";
import { getPageAndFlowDataFromPathname } from "../getPageAndFlowDataFromPathname";
import { getPrunedUserDataFromPathname } from "../getPrunedUserDataFromPathname";
import { type UserDataWithPageData } from "../pageData";
import { FeatureFlag } from "~/services/isFeatureFlagEnabled.server";
import { throw404IfFeatureFlagDisabled } from "~/services/errorPages/throw404";

type OkResult = {
  userData: UserDataWithPageData;
  flow: {
    id: FlowId;
    controller: ReturnType<typeof buildFlowController>;
    validFlowPaths: ValidFlowPagesType;
    userVisitedValidationPage?: boolean;
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
  "/geld-einklagen/formular": "showGeldEinklagenFlow",
} as const;

export const getUserDataAndFlow = async (
  request: Request,
): Promise<Result<OkResult, ErrorResult>> => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");

  const { flowId, stepId, arrayIndexes, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const featureFlag = flowIdFeatureFlag[flowId];

  if (featureFlag) {
    await throw404IfFeatureFlagDisabled(featureFlag);
  }

  const [{ userDataWithPageData, validFlowPaths }, migrationData, flowSession] =
    await Promise.all([
      getPrunedUserDataFromPathname(pathname, cookieHeader),
      getMigrationData(stepId, flowId, currentFlow, cookieHeader),
      getSessionManager(flowId).getSession(cookieHeader),
    ]);

  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userDataWithPageData,
    guards: currentFlow.guards,
  });

  const validationFlowResult = await validateStepIdFlow(
    stepId,
    request,
    flowController,
    currentFlow,
  );

  if (validationFlowResult.isErr) {
    return Result.err({ redirectTo: validationFlowResult.error.redirectTo });
  }

  return Result.ok({
    userData: userDataWithPageData,
    flow: {
      id: flowId,
      controller: flowController,
      validFlowPaths,
      userVisitedValidationPage:
        flowSession.get(userVisitedValidationPageKey) ??
        flowController.getMeta(stepId)?.triggerValidation,
    },
    page: {
      stepId,
      arrayIndexes,
    },
    emailCaptureConsent: flowSession.get(emailCaptureConsentName),
    migration: {
      userData: migrationData,
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
