import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  getSessionData,
  getSessionManager,
  updateSession,
} from "~/services/session.server";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { validateFormData } from "~/services/validation/validateFormData.server";
import type { Context } from "~/models/flows/contexts";
import { parsePathname } from "~/models/flows/contexts";
import { flows } from "~/models/flows/flows.server";
import { isStrapiSelectComponent } from "~/services/cms/models/StrapiSelect";
import { validatedSession } from "~/services/security/csrf.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { logError } from "~/services/logging";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { navItemsFromFlowSpecifics } from "~/services/flowNavigation.server";
import type { z } from "zod";
import type { CollectionSchemas } from "~/services/cms/schemas";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { sendCustomAnalyticsEvent } from "~/services/analytics/customEvent";
import { parentFromParams } from "~/services/params";
import { isStrapiArraySummary } from "~/services/cms/models/StrapiArraySummary";
import { fieldIsArray, splitArrayName } from "~/util/arrayVariable";
import {
  arrayFromSession,
  arrayIndexFromFormData,
  deleteFromArrayInplace,
} from "~/services/session.server/arrayDeletion";
import { interpolateDeep } from "~/util/fillTemplate";
import { stepMeta } from "~/services/meta/formStepMeta";
import { updateMainSession } from "~/services/session.server/updateSessionInHeader";
import { insertIndexesIntoPath } from "~/services/flow/stepIdConverter";

const structureCmsContent = (
  formPageContent: z.infer<CollectionSchemas["form-flow-pages"]>,
) => {
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

function stepDataFromFieldNames(
  fieldNames: string[],
  data: Context,
  arrayIndexes?: number[],
) {
  const arrayIndex = arrayIndexes?.at(0); // For nested arrays we might need to recurse here
  return Object.fromEntries(
    fieldNames.map((fieldName) => {
      let entry = data[fieldName];
      if (fieldIsArray(fieldName) && arrayIndex !== undefined) {
        const [arrayName, arrayFieldname] = splitArrayName(fieldName);
        const arrayForStep = data[arrayName];
        if (Array.isArray(arrayForStep) && arrayForStep.length > arrayIndex)
          entry = arrayForStep[arrayIndex][arrayFieldname];
      }
      return [fieldName, entry];
    }),
  );
}

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);

  const { pathname } = new URL(request.url);
  const { flowId, stepId, arrayIndexes } = parsePathname(pathname);
  const cookieHeader = request.headers.get("Cookie");

  const { userData, debugId } = await getSessionData(flowId, cookieHeader);
  context.debugId = debugId; // For showing in errors

  const currentFlow = flows[flowId];
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userData,
    guards: currentFlow.guards,
  });

  if (!flowController.isReachable(stepId))
    return redirectDocument(flowController.getInitial());

  // get all relevant strapi data
  const pathNameWithoutArrayIndex = `/${flowId}/${stepId}`;
  const lookupPath = pathNameWithoutArrayIndex.includes("persoenliche-daten")
    ? pathNameWithoutArrayIndex.replace("fluggastrechte", "geld-einklagen")
    : pathNameWithoutArrayIndex;
  const [
    formPageContent,
    parentMeta,
    flowStrings,
    navigationStrings,
    defaultStrings,
  ] = await Promise.all([
    fetchCollectionEntry("form-flow-pages", lookupPath),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchTranslations(flowId),
    fetchTranslations(`${flowId}/menu`),
    fetchTranslations("defaultTranslations"),
  ]);
  // structure cms content -> merge with getting data?
  const cmsContent = interpolateDeep(
    structureCmsContent(formPageContent),
    "stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(userData)
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

  // filter user data for current step
  const fieldNames = formPageContent.form.map((entry) => entry.name);
  const stepData = stepDataFromFieldNames(fieldNames, userData, arrayIndexes);

  // get array data to display in ArraySummary
  const strapiArraySummaries =
    formPageContent.pre_form.filter(isStrapiArraySummary);
  const nextArrayItemSteps = flowController.getItems(stepId);

  const arraySummaryData =
    nextArrayItemSteps &&
    Object.fromEntries(
      strapiArraySummaries.map(({ category, categoryUrl }) => {
        const possibleArray = userData[category];
        const data = Array.isArray(possibleArray) ? possibleArray : [];
        const url = `/${flowId}${categoryUrl}`;
        const initialStep =
          nextArrayItemSteps
            .find((possibleItem) => possibleItem.includes(categoryUrl))
            ?.replace(url + "/", "") ?? "";

        return [category, { data, url, initialStep }];
      }),
    );

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

  const navItems = navItemsFromFlowSpecifics(
    stepId,
    flowController,
    navigationStrings,
  );

  const migrationData = await getMigrationData(
    stepId,
    flowId,
    currentFlow,
    cookieHeader,
  );

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
      translations: flowStrings,
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
  const currentFlow = flows[flowId];

  // Note: This also reduces same-named fields to the last entry
  const relevantFormData = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith("_")),
  );

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
  updateSession(flowSession, validationResult.data, arrayIndexes);

  const migrationData = await getMigrationData(
    stepId,
    flowId,
    currentFlow,
    cookieHeader,
  );
  if (migrationData && validationResult.data["doMigration"] === "yes") {
    updateSession(flowSession, migrationData);
  }

  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: flowSession.data,
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
