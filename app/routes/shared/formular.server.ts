import { parseFormData } from "@mjackson/form-data-parser";
import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { retrieveContentData } from "~/services/flow/formular/contentData/retrieveContentData";
import { isFileUploadOrDeleteAction } from "~/services/flow/formular/fileUpload/isFileUploadOrDeleteAction";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { getUserDataAndFlow } from "~/services/flow/userDataAndFlow/getUserDataAndFlow";
import { getDestinationFlowAction } from "~/services/flow/userFlowAction/getDestinationFlowAction";
import { postValidationFormUserData } from "~/services/flow/userFlowAction/postValidationFormUserData";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import {
  deleteUserFile,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";
import { FIFTEEN_MB_IN_BYTES } from "~/services/validation/pdfFileSchema";
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
  const { flowId, arrayIndexes } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const formData = await parseFormData(request.clone(), {
    maxFileSize: FIFTEEN_MB_IN_BYTES,
  });
  const formAction = formData.get("_action");

  if (isFileUploadOrDeleteAction(formAction)) {
    const [action, inputName] = formAction.split(".");
    if (action === "fileUpload") {
      const result = await uploadUserFile(
        inputName,
        cookieHeader,
        formData,
        flowSession.data,
        flowId,
      );
      if ("fieldErrors" in result)
        return validationError(result, result.repopulateFields);
      updateSession(flowSession, result.userData);
    } else if (action === "deleteFile") {
      const userData = await deleteUserFile(
        inputName,
        cookieHeader,
        flowSession.data,
        flowId,
      );
      if (userData) {
        updateSession(flowSession, userData, (_, newData) =>
          Array.isArray(newData) ? newData : undefined,
        );
      }
    }
    return data(flowSession.data, {
      headers: { "Set-Cookie": await commitSession(flowSession) },
      status: 200,
    });
  }

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

  if (resultFormUserData.value.migrationData) {
    updateSession(flowSession, resultFormUserData.value.migrationData);
  }

  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: addPageDataToUserData(flowSession.data, { arrayIndexes }),
    guards: flows[flowId].guards,
  });

  await postValidationFormUserData(
    request,
    flowController,
    resultFormUserData.value.userData,
  );

  const destination = getDestinationFlowAction(flowController, pathname);

  const headers = { "Set-Cookie": await commitSession(flowSession) };
  return redirectDocument(destination, { headers });
};
