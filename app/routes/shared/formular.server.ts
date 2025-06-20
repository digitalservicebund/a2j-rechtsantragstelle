import { validationError } from "@rvf/react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data, redirectDocument } from "react-router";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import {
  fetchFlowPage,
  fetchMeta,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { isStrapiArraySummary } from "~/services/cms/models/isStrapiArraySummary";
import { isStrapiSelectComponent } from "~/services/cms/models/isStrapiSelectComponent";
import { buildFormularServerTranslations } from "~/services/flow/formular/buildFormularServerTranslations";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { executeAsyncFlowActionByStepId } from "~/services/flow/server/executeAsyncFlowActionByStepId";
import { insertIndexesIntoPath } from "~/services/flow/stepIdConverter";
import { navItemsFromStepStates } from "~/services/flowNavigation.server";
import { logWarning } from "~/services/logging";
import { stepMeta } from "~/services/meta/formStepMeta";
import { parentFromParams } from "~/services/params";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import { deleteArrayItem } from "~/services/session.server/arrayDeletion";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import {
  deleteUserFile,
  getUpdatedField,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { applyStringReplacement } from "~/util/applyStringReplacement";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { filterFormData } from "~/util/filterFormData";
import { getUserDataAndFlow } from "./formular/userDataAndFlow/getUserDataAndFlow";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const resultUserAndFlow = await getUserDataAndFlow(request);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData: userDataWithPageData,
    flow: {
      id: flowId,
      controller: flowController,
      current: currentFlow,
      validFlowPaths,
    },
    page: { stepId, arrayIndexes },
  } = resultUserAndFlow.value;

  const { pathname } = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie");

  const [formPageContent, parentMeta, translations] = await Promise.all([
    fetchFlowPage("form-flow-pages", flowId, stepId),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchMultipleTranslations([
      `${flowId}/menu`,
      "defaultTranslations",
      flowId,
      `${flowId}/summaryPage`,
      "accessibility",
    ]),
  ]);

  const arrayCategories = formPageContent.pre_form
    .filter(isStrapiArraySummary)
    .map((strapiSummary) => strapiSummary.category);

  const arraySummaryData = getArraySummaryData(
    arrayCategories,
    flowController.getRootMeta()?.arrays,
    userDataWithPageData,
  );

  const migrationData = await getMigrationData(
    stepId,
    flowId,
    currentFlow,
    cookieHeader,
  );

  const { stringTranslations, cmsContent } =
    await buildFormularServerTranslations({
      currentFlow,
      flowTranslations: translations[flowId],
      migrationData,
      arrayCategories,
      overviewTranslations: translations[`${flowId}/summaryPage`],
      formPageContent,
      userDataWithPageData,
    });

  // Inject heading into <legend> inside radio groups
  // TODO: only do for pages with *one* select?
  const formElements = cmsContent.formContent.map((strapiFormElement) => {
    if (
      isStrapiSelectComponent(strapiFormElement) &&
      strapiFormElement.label === null &&
      cmsContent.heading
    )
      strapiFormElement.altLabel = cmsContent.heading;
    return strapiFormElement;
  });

  const meta = applyStringReplacement(
    stepMeta(formPageContent.pageMeta, parentMeta),
    stringTranslations,
  );

  // Retrieve user data for current step
  const fieldNames = formPageContent.form.map((entry) => entry.name);
  const stepData = fieldsFromContext(userDataWithPageData, fieldNames);

  const { headers, csrf } = await updateMainSession({
    cookieHeader,
    flowId,
    stepId,
  });

  const backDestination = flowController.getPrevious(stepId);

  const backDestinationWithArrayIndexes =
    backDestination && arrayIndexes
      ? insertIndexesIntoPath(pathname, backDestination, arrayIndexes)
      : backDestination;

  const defaultStrings = translations.defaultTranslations;

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel:
      cmsContent.backButtonLabel ?? defaultStrings.backButtonDefaultLabel,
    nextButtonLabel:
      cmsContent.nextButtonLabel ?? defaultStrings.nextButtonDefaultLabel,
    isFinal: flowController.isFinal(stepId),
    backDestination: backDestinationWithArrayIndexes,
  });

  const navItems =
    navItemsFromStepStates(
      stepId,
      flowController.stepStates(),
      translations[`${flowId}/menu`],
    ) ?? [];

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
      navItems,
      postFormContent: cmsContent.postFormContent,
      preHeading: cmsContent.preHeading,
      stepData,
      translations: stringTranslations,
      validFlowPaths,
      flowId,
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
