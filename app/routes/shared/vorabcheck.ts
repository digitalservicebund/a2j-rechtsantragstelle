import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { getUserDataAndFlow } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { flowDestination } from "~/services/flow/userFlowAction/flowDestination";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
export { VorabcheckPage as default } from "~/routes/shared/components/VorabcheckPage";
import { shouldShowReportProblem } from "~/components/content/reportProblem/showReportProblem";
import { pruneIrrelevantData } from "~/services/flow/pruner/pruner";
import { retrieveContentData } from "~/services/flow/vorabcheck/retrieveContentData";

export const loader = async ({ params, request, url }: LoaderFunctionArgs) => {
  const resultUserAndFlow = await getUserDataAndFlow(request, url);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData,
    flow: { id: flowId, controller: flowController },
    page: { stepId, arrayIndexes },
  } = resultUserAndFlow.value;

  const { pathname } = url;

  const contentData = await retrieveContentData(pathname, params, userData);

  const cmsContent = contentData.getCMSContent();
  const formElements = contentData.getFormElements(flowId);
  const stepData = contentData.getStepData();
  const buttonNavigationProps = contentData.getButtonNavigation(
    flowController,
    stepId,
    arrayIndexes,
  );
  const progressProps = contentData.getProgress(flowController, stepId);

  return data({
    stepData,
    cmsContent,
    formElements,
    progressProps,
    buttonNavigationProps,
    showReportProblem: shouldShowReportProblem(stepId),
  });
};

export const action = async ({ request, url }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = url;
  const { flowId } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const formData = await request.formData();

  const resultFormUserData = await validateFormUserData(
    formData,
    pathname,
    cookieHeader,
  );

  if (resultFormUserData.isErr) {
    return validationError(
      resultFormUserData.error.error,
      resultFormUserData.error.submittedData,
    );
  }

  updateSession(flowSession, resultFormUserData.value.userData);

  const { prunedData } = pruneIrrelevantData(flowSession.data, flowId);

  await postValidationFlowAction(request, prunedData, flowSession, url);

  const destination = flowDestination(pathname, prunedData);
  const headers = await commitSession(flowSession);
  return redirectDocument(destination, { headers });
};
