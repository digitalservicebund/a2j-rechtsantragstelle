import { parseFormData } from "@remix-run/form-data-parser";
import { validationError } from "@rvf/react-router";
import {
  type ActionFunctionArgs,
  data,
  type LoaderFunctionArgs,
  redirect,
  redirectDocument,
} from "react-router";
import { shouldShowReportProblem } from "~/components/content/reportProblem/showReportProblem";
import { isFileUploadOrDeleteAction } from "~/components/formElements/inputs/filesUpload/isFileUploadOrDeleteAction";
import {
  type LoaderExtrasContext,
  type LoaderExtras,
  type ExtraDataWithFormElements,
} from "~/services/flow/server/loaderExtras";
import { retrieveContentData } from "~/services/flow/contentData/retrieveContentData";
import { getMetaConfigurationByStepId } from "~/services/flow/getMetaConfigurationByStepId";
import { getPageAndFlowDataFromPathname } from "~/services/flow/getPageAndFlowDataFromPathname";
import { createFlowSession } from "~/services/flow/newFlowEngine/createFlowSession";
import { setUserVisitedValidationPage } from "~/services/flow/server/setUserVisitedValidationPage";
import { getUserDataAndFlowNewEngine } from "~/services/flow/userDataAndFlow/getUserDataAndFlowNewEngine";
import { flowDestinationNewEngine } from "~/services/flow/userFlowAction/flowDestinationNewEngine";
import { generateUserDataToSave } from "~/services/flow/userFlowAction/generateUserDataToSave";
import { postValidationFlowAction } from "~/services/flow/userFlowAction/postValidationFlowAction";
import { validateFormUserData } from "~/services/flow/userFlowAction/validateFormUserData";
import { logWarning } from "~/services/logging";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import { getSessionManager, updateSession } from "~/services/session.server";
import {
  deleteUserFile,
  uploadUserFile,
} from "~/services/upload/fileUploadHelpers.server";
import { FIFTEEN_MB_IN_BYTES } from "~/services/validation/pdfFileSchema";
import { getRedirect } from "~/services/routing/redirects";
import { getMigrationData } from "~/services/session.server/getMigrationData";

// Whether every top-level section is done except the given one. Used to decide
// if a validation gate page can be skipped (its own section is still open).
// Unreachable ("disabled") sections are ignored: they can never be completed,
// so they must not block the skip. This mirrors how a section's own isDone
// already ignores its unreachable child nodes.
export const allOtherSectionsDone = (
  statusTree: Record<string, { isDone: boolean; isReachable: boolean }>,
  excludedSection: string,
): boolean =>
  Object.entries(statusTree)
    .filter(([section]) => section !== excludedSection)
    .every(([, node]) => node.isDone || !node.isReachable);

// The top-level section a stepId belongs to, e.g. "/abgabe/ueberpruefung" gives "/abgabe".
const topLevelSection = (stepId: string): string => `/${stepId.split("/")[1]}`;

// A validation gate must not be passed while another section is still missing
// data, so it gets no next button and its submit stays on the page.
export const isValidationGateBlocked = ({
  triggerValidation,
  statusTree,
  stepId,
}: {
  triggerValidation: boolean;
  statusTree: Record<string, { isDone: boolean; isReachable: boolean }>;
  stepId: string;
}): boolean =>
  triggerValidation &&
  !allOtherSectionsDone(statusTree, topLevelSection(stepId));

// Back must not land on a validation gate that would redirect forward again
// (back from the summary would loop), so it goes to the page before the gate.
export const backPathSkippingValidationGate = ({
  prevPath,
  statusTree,
  isValidationGate,
  prevPathOf,
}: {
  prevPath: string | undefined;
  statusTree: Record<string, { isDone: boolean; isReachable: boolean }>;
  isValidationGate: (path: string) => boolean;
  prevPathOf: (path: string) => string | undefined;
}): string | undefined => {
  if (
    !prevPath ||
    !isValidationGate(prevPath) ||
    !allOtherSectionsDone(statusTree, topLevelSection(prevPath))
  )
    return prevPath;
  return prevPathOf(prevPath);
};

export const loadFormularData = async <
  ExtraData extends ExtraDataWithFormElements = Record<string, never>,
>(
  args: LoaderFunctionArgs,
  extras?: LoaderExtras<ExtraData>,
) => {
  const { params, request, url } = args;

  const redirectDestination = getRedirect(url.pathname);
  if (redirectDestination) return redirect(redirectDestination, 301);

  const resultUserAndFlow = await getUserDataAndFlowNewEngine(request, url);

  if (resultUserAndFlow.isErr) {
    return redirectDocument(resultUserAndFlow.error.redirectTo);
  }

  const {
    userData,
    flow: {
      id: flowId,
      validFlowPaths,
      flowSessionEngine,
      userVisitedValidationPage,
      useStepper,
      triggerValidation,
    },
    page: { stepId, arrayIndexes },
    migration,
    emailCaptureConsent,
  } = resultUserAndFlow.value;

  // A validation gate page (triggerValidation, e.g. /abgabe/ueberpruefung) only
  // needs to be shown while something is still missing. Once every other section
  // is complete, skip ahead to the next step (the summary). This replaces the old
  // XState `always` transition. The gate's own section is not part of the check.
  if (
    triggerValidation &&
    flowSessionEngine.nextPath &&
    allOtherSectionsDone(flowSessionEngine.statusTree, topLevelSection(stepId))
  ) {
    return redirectDocument(flowId + flowSessionEngine.nextPath);
  }

  const { pathname } = url;
  const cookieHeader = request.headers.get("Cookie");

  const context: LoaderExtrasContext = {
    flowId,
    arrayIndexes,
    flowSessionEngine,
  };

  const extraReplacements = await extras?.buildReplacements?.(context);

  const [contentData] = await Promise.all([
    retrieveContentData(
      "form-flow-pages",
      pathname,
      params,
      userData,
      migration.userData,
      extraReplacements,
    ),
    setUserVisitedValidationPage(triggerValidation, flowId, cookieHeader),
  ]);

  const translations = contentData.getTranslations();
  const cmsContent = contentData.getCMSContent();
  const formElements = contentData.getFormElements();
  const stepData = contentData.getStepData();
  const { currentFlow } = getPageAndFlowDataFromPathname(pathname);
  const backPath = backPathSkippingValidationGate({
    prevPath: flowSessionEngine.prevPath,
    statusTree: flowSessionEngine.statusTree,
    isValidationGate: (path) =>
      getMetaConfigurationByStepId(currentFlow, path)?.triggerValidation ??
      false,
    prevPathOf: (path) =>
      "newEngineConfig" in currentFlow && currentFlow.newEngineConfig
        ? createFlowSession(
            currentFlow.newEngineConfig,
            flowSessionEngine.prunedUserData,
            path,
          ).prevPath
        : undefined,
  });
  const buttonNavigationProps = contentData.getButtonNavigationNewEngine(
    flowId,
    {
      ...flowSessionEngine,
      prevPath: backPath,
      isFinal:
        flowSessionEngine.isFinal ||
        isValidationGateBlocked({
          triggerValidation,
          statusTree: flowSessionEngine.statusTree,
          stepId,
        }),
    },
    arrayIndexes,
  );
  const autoGeneratedSectionsRaw =
    await contentData.getAutoSummarySectionsNewEngine(
      flowSessionEngine,
      flowId,
    );
  const autoGeneratedSections = extras?.transformAutoSummary
    ? await extras.transformAutoSummary(autoGeneratedSectionsRaw, context)
    : autoGeneratedSectionsRaw;
  const navigationProps = contentData.getNavPropsNewEngine(
    flowSessionEngine,
    useStepper,
    userVisitedValidationPage,
  );
  const arraySummaryData = contentData.arraySummaryDataNewEngine(
    flowSessionEngine,
    flowId,
  );

  const extraData = await extras?.buildLoaderData?.({
    ...context,
    formElements,
  });

  return data({
    arraySummaryData,
    userData,
    navigationProps,
    buttonNavigationProps,
    cmsContent,
    emailCaptureConsent,
    formElements: extraData?.formElements ?? formElements,
    migration,
    stepData,
    translations,
    validFlowPaths,
    flowId,
    showReportProblem: shouldShowReportProblem(stepId),
    autoGeneratedSections,
    // Cast keeps the extra fields in the return type. Returning the raw
    // `ExtraData | undefined` would otherwise erase them; at runtime `undefined`
    // simply spreads to nothing, which is the no-extras case.
    extraData: extraData as ExtraData,
  });
};

export const runFormularAction = async (args: ActionFunctionArgs) => {
  const { request, url } = args;

  const resultValidatedSession = await validatedSession(request);
  if (resultValidatedSession.isErr) {
    logWarning(resultValidatedSession.error);
    throw new Response(null, { status: 403 });
  }

  const { pathname } = url;
  const { flowId, currentFlow, arrayIndexes, stepId } =
    getPageAndFlowDataFromPathname(pathname);

  const compiledStaticFlow =
    "newEngineConfig" in currentFlow ? currentFlow.newEngineConfig : undefined;

  // TODO - Remove this check later, once we migrated all the flows to the new engine
  if (!compiledStaticFlow) {
    throw new Response(null, { status: 404 });
  }

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
        pathname,
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
      headers: await commitSession(flowSession),
      status: 200,
    });
  }

  const [resultFormUserData, migrationData] = await Promise.all([
    validateFormUserData(formData, pathname),
    getMigrationData(stepId, flowId, currentFlow, cookieHeader),
  ]);

  if (resultFormUserData.isErr) {
    return validationError(
      resultFormUserData.error.error,
      resultFormUserData.error.submittedData,
    );
  }

  const userDataToSave = generateUserDataToSave(
    stepId,
    {
      sessionUserData: flowSession.data,
      formUserData: resultFormUserData.value.userData,
      migrationData,
    },
    flowId,
    compiledStaticFlow,
  );

  updateSession(flowSession, userDataToSave, (_, newData, key) =>
    key === "pageData" ? newData : undefined,
  );

  const flowSessionEngineSaved = createFlowSession(
    compiledStaticFlow,
    {
      ...(userDataToSave as Parameters<typeof createFlowSession>[1]),
      pageData: {
        ...userDataToSave.pageData,
        // Need to inject arrayIndexes here for index-dependent guards, like conditional routing inside of arrays
        arrayIndexes,
      },
    },
    stepId,
  );

  await postValidationFlowAction(
    request,
    flowSessionEngineSaved.prunedUserData,
    flowSession,
    url,
  );

  const headers = await commitSession(flowSession);
  const gateBlocked = isValidationGateBlocked({
    triggerValidation:
      getMetaConfigurationByStepId(currentFlow, stepId)?.triggerValidation ??
      false,
    statusTree: flowSessionEngineSaved.statusTree,
    stepId,
  });
  const destination = gateBlocked
    ? pathname
    : flowDestinationNewEngine(pathname, flowSessionEngineSaved);
  return redirectDocument(destination, { headers });
};
