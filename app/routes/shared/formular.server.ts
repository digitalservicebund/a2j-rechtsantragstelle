import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  redirectDocument,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { parsePathname } from "~/domains/flowIds";
import { flows } from "~/domains/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getArraySummaryData } from "~/services/array/getArraySummaryData";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { isStrapiSelectComponent } from "~/services/cms/components/StrapiSelect";
import {
  fetchFlowPage,
  fetchMeta,
  fetchMultipleTranslations,
} from "~/services/cms/index.server";
import { isStrapiArraySummary } from "~/services/cms/models/StrapiArraySummary";
import { buildFormularServerTranslations } from "~/services/flow/formular/buildFormularServerTranslations";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import {
  validateFlowTransition,
  getFlowTransitionConfig,
} from "~/services/flow/server/flowTransitionValidation";
import { insertIndexesIntoPath } from "~/services/flow/stepIdConverter";
import { navItemsFromStepStates } from "~/services/flowNavigation.server";
import { logWarning } from "~/services/logging";
import { stepMeta } from "~/services/meta/formStepMeta";
import {
  parentFromParams,
  skipFlowParamAllowedAndEnabled,
} from "~/services/params";
import { validatedSession } from "~/services/security/csrf/validatedSession.server";
import {
  getSessionData,
  getSessionManager,
  updateSession,
} from "~/services/session.server";
import {
  arrayFromSession,
  arrayIndexFromFormData,
  deleteFromArrayInplace,
} from "~/services/session.server/arrayDeletion";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { fieldsFromContext } from "~/services/session.server/fieldsFromContext";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { filterFormData } from "~/util/filterFormData";

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  const { pathname, searchParams } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");
  const { userData, debugId } = await getSessionData(flowId, cookieHeader);
  context.debugId = debugId; // For showing in errors

  const currentFlow = flows[flowId];
  const prunedUserData = await pruneIrrelevantData(userData, flowId);
  const userDataWithPageData = addPageDataToUserData(prunedUserData, {
    arrayIndexes,
  });
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userDataWithPageData,
    guards: currentFlow.guards,
  });

  if (
    !flowController.isReachable(stepId) &&
    !skipFlowParamAllowedAndEnabled(searchParams)
  )
    return redirectDocument(flowController.getInitial());

  const flowTransitionConfig = getFlowTransitionConfig(currentFlow);
  if (flowTransitionConfig) {
    const eligibilityResult = await validateFlowTransition(
      flows,
      cookieHeader,
      flowTransitionConfig,
    );

    if (!eligibilityResult.isEligible && eligibilityResult.redirectTo) {
      return redirectDocument(eligibilityResult.redirectTo);
    }
  }

  const [formPageContent, parentMeta, translations] = await Promise.all([
    fetchFlowPage("form-flow-pages", flowId, stepId),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchMultipleTranslations([
      `${flowId}/menu`,
      "defaultTranslations",
      flowId,
      `${flowId}/summaryPage`,
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

  const meta = stepMeta(formPageContent.pageMeta, parentMeta);

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

  const navigationA11yLabels = {
    menuLabel: defaultStrings.navigationA11yLabel,
    itemFinished: defaultStrings.navigationItemFinishedA11yLabel,
    itemOpen: defaultStrings.navigationItemOpenA11yLabel,
  };

  return json(
    {
      arraySummaryData,
      prunedUserData,
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
            ? currentFlow.migration.sortedFields
            : undefined,
        buttonUrl:
          "migration" in currentFlow
            ? currentFlow.migration.buttonUrl
            : undefined,
      },
      navItems,
      postFormContent: cmsContent.postFormContent,
      preHeading: cmsContent.preHeading,
      stepData,
      translations: stringTranslations,
      navigationA11yLabels,
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
  const formData = await unstable_parseMultipartFormData(
    request,
    async ({ name, filename }) => {
      if (name !== "application/pdf") {
        return undefined;
      }
      return Promise.resolve(filename);
    },
  );
  const relevantFormData = filterFormData(formData);

  if (formData.get("_action") === "delete") {
    try {
      const { arrayName, index } = arrayIndexFromFormData(relevantFormData);
      const arrayToMutate = arrayFromSession(arrayName, flowSession);
      deleteFromArrayInplace(arrayToMutate, index);
      updateSession(flowSession, { [arrayName]: arrayToMutate });
      const headers = { "Set-Cookie": await commitSession(flowSession) };
      return new Response("success", { status: 200, headers });
    } catch (err) {
      return new Response((err as Error).message, { status: 422 });
    }
  }

  const validationResult = await validateFormData(pathname, relevantFormData);

  if (validationResult.error)
    return validationError(
      validationResult.error,
      validationResult.submittedData,
    );

  const resolvedData = resolveArraysFromKeys(
    validationResult.data,
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
      properties: validationResult.data,
    });
  }

  const destination =
    flowController.getNext(stepId) ?? flowController.getInitial();

  const destinationWithArrayIndexes = arrayIndexes
    ? insertIndexesIntoPath(pathname, destination, arrayIndexes)
    : destination;

  const headers = { "Set-Cookie": await commitSession(flowSession) };
  return redirectDocument(destinationWithArrayIndexes, { headers });
};
