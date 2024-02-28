import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  getSessionData,
  getSessionForContext,
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
import {
  updateSessionWithCsrfToken,
  validatedSession,
} from "~/services/security/csrf.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { logError } from "~/services/logging";
import { lastStepKey } from "~/services/flow/constants";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { navItemsFromFlowSpecifics } from "~/services/flowNavigation.server";
import type { z } from "zod";
import type { CollectionSchemas } from "~/services/cms/schemas";
import { getButtonNavigationProps } from "~/util/buttonProps";
import { sendCustomEvent } from "~/services/analytics/customEvent";
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
import { updateSessionInHeader } from "~/services/session.server/updateSessionInHeader";

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
  arrayIndex?: number,
) {
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

  // get data from request
  const { pathname, searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") ?? undefined;
  const { flowId, stepId, arrayIndex } = parsePathname(pathname);
  const cookieId = request.headers.get("Cookie");

  const { userDataFromRedis, sessionId } = await getSessionData(
    flowId,
    cookieId,
  );
  context.sessionId = sessionId; // For showing in errors

  // get flow controller
  const currentFlow = flows[flowId];
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: userDataFromRedis,
    guards: currentFlow.guards,
  });

  // check funnel logic -> Vorabcheck + Formular?
  if (!returnTo && !flowController.isReachable(stepId))
    return redirectDocument(flowController.getInitial().url);

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
      ? currentFlow.stringReplacements(userDataFromRedis)
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

  // get meta content for step, used in breadcrumbs -> actually only Vorabcheck, *but* used in root.tsx
  const meta = stepMeta(formPageContent.meta, parentMeta);

  // filter user data for current step
  const fieldNames = formPageContent.form.map((entry) => entry.name);
  const stepData = stepDataFromFieldNames(
    fieldNames,
    userDataFromRedis,
    arrayIndex,
  );

  // get array data to display in ArraySummary -> Formular + Vorabcheck?
  const arrayData = Object.fromEntries(
    formPageContent.pre_form.filter(isStrapiArraySummary).map((entry) => {
      const possibleArray = userDataFromRedis[entry.arrayKey];
      return [
        entry.arrayKey,
        Array.isArray(possibleArray) ? possibleArray : [],
      ];
    }),
  );

  const { headers, csrf } = await updateSessionInHeader({
    request,
    flowId,
    stepId,
  });

  const buttonNavigationProps = getButtonNavigationProps({
    flowController,
    stepId,
    nextButtonLabel: cmsContent.nextButtonLabel,
    defaultStrings,
    returnTo,
  });

  // get navigation items -> Formular
  const navItems = navItemsFromFlowSpecifics(
    stepId,
    flowController,
    navigationStrings,
  );

  // get migration data to display -> Formular
  const migrationData = await getMigrationData(
    stepId,
    flowId,
    currentFlow,
    cookieId,
  );

  return json(
    {
      arrayData,
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
      returnTo,
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
  const { flowId, stepId, arrayIndex } = parsePathname(pathname);
  const { getSession, commitSession } = getSessionForContext(flowId);
  const cookieId = request.headers.get("Cookie");
  const flowSession = await getSession(cookieId);

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
  updateSession(flowSession, validationResult.data, arrayIndex);

  const migrationData = await getMigrationData(
    stepId,
    flowId,
    currentFlow,
    cookieId,
  );
  if (migrationData && validationResult.data["doMigration"] === "yes") {
    updateSession(flowSession, migrationData);
  }

  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: flowSession.data,
    guards: flows[flowId].guards,
  });

  const customEventName = flowController.getMeta(stepId)?.customEventName;
  if (customEventName) {
    sendCustomEvent({
      request,
      eventName: customEventName,
      properties: validationResult.data,
    });
  }

  const returnTo = formData.get("_returnTo");
  const destination =
    returnTo && typeof returnTo === "string" && returnTo !== ""
      ? returnTo
      : flowController.getNext(stepId)?.url ?? flowController.getInitial().url;

  const headers = { "Set-Cookie": await commitSession(flowSession) };
  return redirectDocument(destination, { headers });
};
