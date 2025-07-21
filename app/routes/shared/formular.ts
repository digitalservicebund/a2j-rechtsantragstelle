import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { retrieveContentData } from "~/services/flow/formular/contentData/retrieveContentData";
import { isFileUploadOrDeleteAction } from "~/services/flow/formular/fileUpload/isFileUploadOrDeleteAction";
import { processUserFile } from "~/services/flow/formular/fileUpload/processUserFile.server";
import { getUserDataAndFlow } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { flowDestination } from "~/services/flow/userFlowAction/flowDestination";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
export { FormFlowPage as default } from "~/routes/shared/components/FormFlowPage";
import { shouldShowReportProblem } from "../../components/reportProblem/showReportProblem";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const resultUserAndFlow = await getUserDataAndFlow(request);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData: userDataWithPageData,
    flow: { id: flowId, controller: flowController, validFlowPaths },
    page: { stepId, arrayIndexes },
    migration,
    emailCaptureConsent,
  } = resultUserAndFlow.value;

  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");

  const [contentData, { headers, csrf }] = await Promise.all([
    retrieveContentData(
      pathname,
      params,
      userDataWithPageData,
      migration.userData,
    ),
    updateMainSession({
      cookieHeader,
      flowId,
      stepId,
    }),
  ]);

  const translations = contentData.getTranslations();
  const navItems = contentData.getNavItems(flowController, stepId);
  const cmsContent = contentData.getCMSContent();
  const formElements = contentData.getFormElements();
  const meta = contentData.getMeta();
  const arraySummaryData = contentData.arraySummaryData(flowController);
  const stepData = contentData.getStepData();
  const buttonNavigationProps = contentData.getButtonNavigation(
    flowController,
    pathname,
    stepId,
    arrayIndexes,
  );

  return data(
    {
      arraySummaryData,
      prunedUserData: userDataWithPageData,
      buttonNavigationProps,
      content: cmsContent.content,
      csrf,
      emailCaptureConsent,
      formElements,
      heading: cmsContent.heading,
      meta,
      migration,
      navItems,
      isValidationPage: flowController.getMeta(stepId)?.expandValidation,
      postFormContent: cmsContent.postFormContent,
      preHeading: cmsContent.preHeading,
      stepData,
      translations,
      validFlowPaths,
      flowId,
      showReportProblem: shouldShowReportProblem(flowId, stepId),
    },
    { headers },
  );
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = new URL(request.url);
  const { flowId } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const clonedFormData = await request.clone().formData();
  const formAction = clonedFormData.get("_action");

  if (isFileUploadOrDeleteAction(formAction)) {
    const result = await processUserFile(formAction, request, flowSession);

    switch (result.variant) {
      case "Err": {
        return validationError(result.error, result.error?.repopulateFields);
      }
      case "Ok": {
        const { userData, mergeCustomizer } = result.value;
        if (userData) {
          updateSession(flowSession, userData, mergeCustomizer);
        }
        return data(flowSession.data, {
          headers: { "Set-Cookie": await commitSession(flowSession) },
          status: 200,
        });
      }
    }
  }

  const resultFormUserData = await validateFormUserData(
    clonedFormData,
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

  if (resultFormUserData.value.migrationData) {
    updateSession(flowSession, resultFormUserData.value.migrationData);
  }
  await postValidationFlowAction(request, resultFormUserData.value.userData);

  const headers = { "Set-Cookie": await commitSession(flowSession) };
  const destination = flowDestination(pathname, flowSession.data);
  return redirectDocument(destination, { headers });
};
