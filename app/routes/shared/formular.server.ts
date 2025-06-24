import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { retrieveContentData } from "~/services/flow/formular/contentData/retrieveContentData";
import { getUserDataAndFlow } from "~/services/flow/formular/userDataAndFlow/getUserDataAndFlow";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { executeAsyncFlowActionByStepId } from "~/services/flow/server/executeAsyncFlowActionByStepId";
import { insertIndexesIntoPath } from "~/services/flow/stepIdConverter";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { deleteArrayItem } from "~/services/session.server/arrayDeletion";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import {
  deleteUserFile,
  getUpdatedField,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { filterFormData } from "~/util/filterFormData";
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
      formElements,
      heading: cmsContent.heading,
      meta,
      migration,
      navItems,
      postFormContent: cmsContent.postFormContent,
      preHeading: cmsContent.preHeading,
      stepData,
      translations,
      validFlowPaths,
      flowId,
      showReportProblem: shouldShowReportProblem(flowId),
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
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const clonedFormData = await request.clone().formData();
  const formAction = clonedFormData.get("_action");
  if (formAction === "delete") {
    // array item deletion, skip everything else
    return await deleteArrayItem(flowId, clonedFormData, request);
  } else if (
    typeof formAction === "string" &&
    formAction.startsWith("fileUpload")
  ) {
    const { validationResult, validationError } = await uploadUserFile(
      formAction,
      request,
      flowSession.data,
      flowId,
    );
    if (validationError) return validationError;
    updateSession(flowSession, resolveArraysFromKeys(validationResult!.data));
    return data(flowSession.data, {
      headers: { "Set-Cookie": await commitSession(flowSession) },
    });
  } else if (
    typeof formAction === "string" &&
    formAction.startsWith("deleteFile")
  ) {
    const fileDeleted = await deleteUserFile(
      formAction,
      request.headers.get("Cookie"),
      flowSession.data,
      flowId,
    );
    if (fileDeleted) {
      updateSession(
        flowSession,
        getUpdatedField(formAction.split(".")[1], flowSession.data),
        /**
         * if the new data is an array, fully overwrite existing data as lodash can't overwrite an existing array with an empty array (if all files are deleted)
         */
        (_, newData) => {
          if (Array.isArray(newData)) {
            return newData;
          }
        },
      );
    }
    return data(flowSession.data, {
      headers: { "Set-Cookie": await commitSession(flowSession) },
    });
  }

  const relevantFormData = filterFormData(clonedFormData);
  const validationResult = await validateFormData(pathname, relevantFormData);

  if (validationResult?.error) {
    return validationError(
      validationResult.error,
      validationResult.submittedData,
    );
  }

  const resolvedData = resolveArraysFromKeys(
    validationResult?.data,
    arrayIndexes,
  );
  updateSession(flowSession, resolvedData);

  const migrationData = await getMigrationData(
    stepId,
    flowId,
    flows[flowId],
    cookieHeader,
  );
  if (migrationData) {
    updateSession(flowSession, migrationData);
  }

  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: addPageDataToUserData(flowSession.data, { arrayIndexes }),
    guards: flows[flowId].guards,
  });

  const customAnalyticsEventName =
    flowController.getMeta(stepId)?.customAnalyticsEventName;
  if (customAnalyticsEventName) {
    sendCustomAnalyticsEvent({
      request,
      eventName: customAnalyticsEventName,
      properties: validationResult?.data,
    });
  }

  await executeAsyncFlowActionByStepId(flows[flowId], stepId, request);

  const destination =
    flowController.getNext(stepId) ?? flowController.getInitial();

  const destinationWithArrayIndexes = arrayIndexes
    ? insertIndexesIntoPath(pathname, destination, arrayIndexes)
    : destination;

  const headers = { "Set-Cookie": await commitSession(flowSession) };
  return redirectDocument(destinationWithArrayIndexes, { headers });
};
