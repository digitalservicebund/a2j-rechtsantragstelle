import {
  data,
  type ActionFunctionArgs,
  redirectDocument,
  type LoaderFunctionArgs,
} from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { erbfolgeStaticFlow } from "~/domains/erbschein/erbfolge/flowConfig";
import type { ArrayData, UserData } from "~/domains/userData";
import { resolveArrayCharacter } from "~/services/array/resolveArrayCharacter";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { createFlowSession } from "~/services/flow/newFlowEngine/sessionInterpreter";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import {
  getSessionData,
  getSessionManager,
  updateSession,
} from "~/services/session.server";
import { resolveUserData } from "~/services/session.server/resolveUserData";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { ArraySummaryProps } from "~/components/content/arraySummary/KernArraySummary";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const fullUserData = addPageDataToUserData(
    await getSessionData(flowId, cookieHeader),
    { arrayIndexes },
  );

  // TODO: pass flowId, stepId, arrayIndexes into createFlowSession?
  const sessionManager = createFlowSession(
    erbfolgeStaticFlow,
    fullUserData,
    stepId,
  );

  // TODO: prune inside createFlowSession?
  const prunedUserData = fullUserData;

  const { pageSchema, arrayInfos } = sessionManager;
  const arrayName = arrayInfos?.arrayName;
  const isArraySummaryPage =
    arrayInfos?.arraySchema !== undefined && arrayName !== undefined;
  const fieldNames = Object.keys(pageSchema.def.shape);
  if (isArraySummaryPage) fieldNames.push(arrayName);
  const stepData = resolveUserData(prunedUserData, fieldNames);
  // console.log(prunedUserData, fieldNames);

  const prevStepId = sessionManager.getPrevStep();
  const backDestination = prevStepId
    ? flowId + resolveArrayCharacter(prevStepId, arrayIndexes, false)
    : undefined;

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: "Zurück",
    nextButtonLabel: "Weiter",
    isFinal: erbfolgeStaticFlow.isFinal(stepId),
    backDestination,
  });

  const arraySummaryData: ArraySummaryProps | undefined =
    isArraySummaryPage &&
    arrayInfos &&
    arrayInfos.arrayName &&
    arrayInfos.entryPoint
      ? {
          category: arrayInfos.arrayName,
          arrayData: {
            data: (stepData[arrayInfos.arrayName] ?? []) as ArrayData,
            configuration: {
              url: flowId + resolveArrayCharacter(stepId, arrayIndexes, false),
              initialInputUrl: arrayInfos.entryPoint,
              disableAddButton: false,
            },
          },
          content: {
            buttonLabel: arrayInfos.arrayName,
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
    progressProps: erbfolgeStaticFlow.getProgress(stepId),
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

  const nextStepId = sessionManager.getNextStep();
  if (!nextStepId) throw new Error("no nextStepId");
  const destination =
    flowId + resolveArrayCharacter(nextStepId, arrayIndexes, false);

  const headers = await commitSession(flowSession);
  return redirectDocument(destination, { headers });
};
