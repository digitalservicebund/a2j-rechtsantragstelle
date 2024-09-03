import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import type { Context } from "~/flows/contexts";
import { parsePathname } from "~/flows/flowIds";
import type { Flow } from "~/flows/flows.server";
import { flows } from "~/flows/flows.server";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { getArraySummaryPageTranslations } from "~/services/array/getArraySummaryPageTranslations";
import { getSummaryData } from "~/services/array/getSummaryData";
import { resolveArraysFromKeys } from "~/services/array/resolveArraysFromKeys";
import { isStrapiSelectComponent } from "~/services/cms/components/StrapiSelect";
import { fetchAllFormFields } from "~/services/cms/fetchAllFormFields";
import { getFieldsByFormElements } from "~/services/cms/getFieldsByFormElements";
import type { Translations } from "~/services/cms/index.server";
import {
  fetchFlowPage,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { isStrapiArraySummary } from "~/services/cms/models/StrapiArraySummary";
import type { StrapiFormFlowPage } from "~/services/cms/models/StrapiFormFlowPage";
import { isFeatureFlagEnabled } from "~/services/featureFlags";
import { addPageDataToUserData } from "~/services/flow/pageData";
import { pruneIrrelevantData } from "~/services/flow/pruner";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { insertIndexesIntoPath } from "~/services/flow/stepIdConverter";
import { navItemsFromStepStates } from "~/services/flowNavigation.server";
import { logError } from "~/services/logging";
import { stepMeta } from "~/services/meta/formStepMeta";
import { parentFromParams } from "~/services/params";
import { validatedSession } from "~/services/security/csrf.server";
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
import {
  validateFlowTransition,
  getFlowTransitionConfig,
} from "~/services/session.server/flowTransitionValidation.server";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { validateFormData } from "~/services/validation/validateFormData.server";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { interpolateDeep } from "~/util/fillTemplate";
import { filterFormData } from "~/util/filterFormData";

const structureCmsContent = (formPageContent: StrapiFormFlowPage) => {
  return {
    heading: "heading" in formPageContent ? formPageContent.heading : undefined,
    preHeading:
      "preHeading" in formPageContent ? formPageContent.preHeading : undefined,
    nextButtonLabel:
      "nextButtonLabel" in formPageContent
        ? formPageContent.nextButtonLabel
        : undefined,
    content: formPageContent.pre_form,
    formContent: formPageContent.form,
    postFormContent:
      "post_form" in formPageContent ? formPageContent.post_form : [],
  };
};

function getInterpolateFlowTranslations(
  currentFlow: Flow,
  flowTranslations: Translations,
  migrationData: Context | undefined,
): Translations {
  if (
    typeof migrationData === "undefined" ||
    typeof currentFlow.stringReplacements === "undefined"
  ) {
    return flowTranslations;
  }

  /* On the Fluggastrechte pages on the MigrationDataOverview data as airlines and airports 
    can not be translated, so it's required to be interpolated 
  */
  return interpolateDeep(
    flowTranslations,
    currentFlow.stringReplacements(migrationData),
  );
}

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");

  const [isEnabledPruneUserData, { userData, debugId }, formFields] =
    await Promise.all([
      isFeatureFlagEnabled("pruneUserData"),
      getSessionData(flowId, cookieHeader),
      fetchAllFormFields(flowId),
    ]);

  context.debugId = debugId; // For showing in errors

  const currentFlow = flows[flowId];
  const prunedUserData = isEnabledPruneUserData
    ? pruneIrrelevantData(userData, flowId, formFields)
    : userData;
  const userDataWithPageData = addPageDataToUserData(prunedUserData, {
    arrayIndexes,
  });
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userDataWithPageData,
    guards: currentFlow.guards,
  });

  if (!flowController.isReachable(stepId))
    return redirectDocument(flowController.getInitial());

  const [
    formPageContent,
    parentMeta,
    navigationStrings,
    defaultStrings,
    flowTranslations,
  ] = await Promise.all([
    fetchFlowPage("form-flow-pages", flowId, stepId),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchTranslations(`${flowId}/menu`),
    fetchTranslations("defaultTranslations"),
    fetchTranslations(flowId),
  ]);

  const arrayConfigurations = flowController.getRootMeta()?.arrays;

  const arrayCategories = formPageContent.pre_form
    .filter(isStrapiArraySummary)
    .map((strapiSummary) => strapiSummary.category);

  const arraySummaryData = getSummaryData(
    arrayCategories,
    arrayConfigurations,
    userDataWithPageData,
  );

  const migrationData = await getMigrationData(
    stepId,
    flowId,
    currentFlow,
    cookieHeader,
  );

  const flowTranslationsAfterInterpolation = getInterpolateFlowTranslations(
    currentFlow,
    flowTranslations,
    migrationData,
  );

  const arrayTranslations =
    await getArraySummaryPageTranslations(arrayCategories);

  const stringTranslations = {
    ...arrayTranslations,
    ...flowTranslationsAfterInterpolation,
  };

  // structure cms content -> merge with getting data?
  const cmsContent = interpolateDeep(
    structureCmsContent(formPageContent),
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userDataWithPageData)
      : {},
  );

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

  const meta = stepMeta(formPageContent.meta, parentMeta);

  // Retrieve user data for current step
  const fieldNames = getFieldsByFormElements(formElements);
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

  const buttonNavigationProps = getButtonNavigationProps({
    backButtonLabel: defaultStrings["backButtonDefaultLabel"],
    nextButtonLabel:
      cmsContent.nextButtonLabel ?? defaultStrings["nextButtonDefaultLabel"],
    isFinal: flowController.isFinal(stepId),
    backDestination: backDestinationWithArrayIndexes,
  });

  const navItems =
    navItemsFromStepStates(
      stepId,
      flowController.stepStates(),
      navigationStrings,
    ) ?? [];

  const flowTransitionConfig = getFlowTransitionConfig(currentFlow);

  if (flowTransitionConfig) {
    const eligibilityResult = await validateFlowTransition(
      flows,
      flowId,
      cookieHeader,
      flowTransitionConfig,
    );

    if (!eligibilityResult.isEligible && eligibilityResult.redirectTo) {
      return redirectDocument(eligibilityResult.redirectTo);
    }
  }

  const navigationA11yLabels = {
    menuLabel: defaultStrings["navigationA11yLabel"],
    itemFinished: defaultStrings["navigationItemFinishedA11yLabel"],
    itemOpen: defaultStrings["navigationItemOpenA11yLabel"],
  };

  return json(
    {
      arraySummaryData,
      buttonNavigationProps,
      content: cmsContent.content,
      csrf,
      formElements,
      heading: cmsContent.heading,
      meta,
      migrationData,
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
  try {
    await validatedSession(request);
  } catch (csrfError) {
    logError({ error: csrfError });
    throw new Response(null, { status: 403 });
  }
  const { pathname } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionManager(flowId);
  const cookieHeader = request.headers.get("Cookie");
  const flowSession = await getSession(cookieHeader);
  const formData = await request.formData();
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

  const validationResult = await validateFormData(flowId, relevantFormData);

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
  if (migrationData && validationResult.data["doMigration"] === "yes") {
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
