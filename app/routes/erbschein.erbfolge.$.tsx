import {
  data,
  type ActionFunctionArgs,
  redirectDocument,
  type LoaderFunctionArgs,
  redirect,
} from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { erbfolgeStaticFlow } from "~/domains/erbschein/erbfolge/flowConfig";
import type { ArrayData, UserData } from "~/domains/userData";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import {
  getSessionData,
  getSessionManager,
  updateSession,
} from "~/services/session.server";
import { resolveUserData } from "~/services/session.server/resolveUserData";
import { getButtonNavigationProps } from "~/util/buttonProps";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

const staticFlow = erbfolgeStaticFlow;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const fullUserData = addPageDataToUserData(
    await getSessionData(flowId, cookieHeader),
    { arrayIndexes },
  );

  // TODO: pass flowId, arrayIndexes into createFlowSession?
  const flowSession = createFlowSession(staticFlow, fullUserData, stepId);

  if (!flowSession.isReachable(stepId)) {
    return redirect(flowId + flowSession.initialPath);
  }

  const { arrayInfo, fieldNames } = flowSession;

  const fieldNamesForPage = arrayInfo // TODO: Add arrayInfo.name into flowSession.fieldnames?
    ? [...fieldNames, arrayInfo.name]
    : fieldNames;

  const stepData = resolveUserData(
    flowSession.prunedUserData,
    fieldNamesForPage,
  );

  const prevStepId = flowSession.prevPath;
  const backDestination = prevStepId
    ? flowId + resolveArrayCharacter(prevStepId, arrayIndexes, false) // TODO: move resolveArrayCharacter(prevPath) into flowSession
    : undefined;

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: "Zurück",
    nextButtonLabel: "Weiter",
    isFinal: erbfolgeStaticFlow.isFinal(stepId), //move into flowSession
    backDestination,
  });

  const arraySummaryData =
    arrayInfo?.entryPoint !== undefined
      ? {
          category: arrayInfo.name,
          arrayData: {
            data: (stepData[arrayInfo.name] ?? []) as ArrayData,
            configuration: {
              url: flowId + resolveArrayCharacter(stepId, arrayIndexes, false), // TODO: move into flowSession, exposed resolvedStepId
              initialInputUrl: arrayInfo.entryPoint,
              disableAddButton: false,
            },
          },
          content: {
            buttonLabel: arrayInfo.name,
            itemLabels: { label: "itemLabel" },
          },
        }
      : undefined;

  return data({
    arraySummaryData,
    stepData,
    cmsContent: {
      pre_form: [{ text: stepId, __component: "basic.heading" }],
    },
    formElements: [],
    progressProps: erbfolgeStaticFlow.getProgress(stepId), // TODO: replace by flowSession.progress
    buttonNavigationProps,
    // showReportProblem: shouldShowReportProblem(stepId),
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const formData = await request.formData();
  // manually filter everything starting with _
  const submittedData = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith("_")),
  );
  const pageSchema = erbfolgeStaticFlow.getSchema(stepId);
  if (!pageSchema) return;
  const validatedFormSubmission = pageSchema.safeParse(submittedData);
  if (!validatedFormSubmission.success) return;

  const resolvedData = resolveArraysFromKeys(
    validatedFormSubmission.data as UserData,
    arrayIndexes,
  );

  updateSession(flowSession, resolvedData);

  const fullUserData = addPageDataToUserData(flowSession.data, {
    arrayIndexes,
  });

  const sessionManager = createFlowSession(
    erbfolgeStaticFlow,
    fullUserData,
    stepId,
  );

  const nextStepId = sessionManager.nextPath;
  if (!nextStepId) throw new Error("no nextStepId");
  const destination =
    flowId + resolveArrayCharacter(nextStepId, arrayIndexes, false);

  const headers = await commitSession(flowSession);
  return redirectDocument(destination, { headers });
};
