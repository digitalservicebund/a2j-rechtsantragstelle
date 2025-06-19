import { Result } from "true-myth";
import { type ValidFlowPagesType } from "~/components/form/formFlowContext";
import { type FlowId } from "~/domains/flowIds";
import { type Flow } from "~/domains/flows.server";
import { type UserData } from "~/domains/userData";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { getPageAndFlowDataFromPathname } from "./getPageAndFlowDataFromPathname";
import { getUserPrunedDataFromPathname } from "./getUserPrunedDataFromPathname";
import { validateStepIdFlow } from "./validateStepIdFlow";

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
    arrayIndexes?: number[];
  };
  migration: {
    userData: UserData | undefined;
    sortedFields?: string[];
    buttonUrl?: string;
  };
};

type ErrorResult = {
  redirectTo: string;
};

export const getUserDataAndFlow = async (
  request: Request,
): Promise<Result<OkResult, ErrorResult>> => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");

  const { flowId, stepId, arrayIndexes, currentFlow } =
    getPageAndFlowDataFromPathname(pathname);

  const [{ userDataWithPageData, validFlowPaths }, migrationData] =
    await Promise.all([
      getUserPrunedDataFromPathname(pathname, cookieHeader),
      getMigrationData(stepId, flowId, currentFlow, cookieHeader),
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
      current: currentFlow,
      controller: flowController,
      validFlowPaths,
    },
    page: {
      stepId,
      arrayIndexes,
    },
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
