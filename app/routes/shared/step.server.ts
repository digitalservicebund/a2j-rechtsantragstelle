import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirectDocument } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { getSessionForContext, updateSession } from "~/services/session.server";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchSingleEntry,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { buildStepValidator } from "~/models/flows/common";
import type { ArrayCollection, Context } from "~/models/flows/contexts";
import { getContext, parsePathname } from "~/models/flows/contexts";
import { flows } from "~/models/flows/flows.server";
import type { StrapiSelect } from "~/services/cms/models/StrapiSelect";
import {
  createCSRFToken,
  csrfSessionFromRequest,
  validatedSession,
} from "~/services/security/csrf.server";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { logError } from "~/services/logging";
import { lastStepKey } from "~/services/flow/constants";
import { getMigrationData } from "~/services/session.server/crossFlowMigration";
import { navItemsFromFlowSpecifics } from "~/services/flowNavigation.server";
import type { z } from "zod";
import type { CollectionSchemas } from "~/services/cms/schemas";
import { getButtonNavigationProps } from "~/util/getButtonNavigationProps";
import { sendCustomEvent } from "~/services/analytics/customEvent";
import { parentFromParams } from "~/services/params";
import { isStrapiArraySummary } from "~/services/cms/models/StrapiArraySummary";
import { fieldIsArray, splitArrayName } from "~/util/arrayVariable";
import {
  arrayFromSession,
  arrayIndexFromFormData,
  deleteFromArrayInplace,
} from "~/services/session.server/arrayDeletion";
import type { StrapiMeta } from "~/services/cms/models/StrapiMeta";

const structureCmsContent = (
  formPageContent: z.infer<
    CollectionSchemas["form-flow-pages" | "vorab-check-pages"]
  >,
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
      "post_form" in formPageContent ? formPageContent.post_form : undefined,
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

function stepMeta(pageMeta: StrapiMeta, parentMeta: StrapiMeta | null) {
  // The breadcrumb should not contain the current step title
  // Also, the parent page title needs to be appended manually to the title
  return {
    description: pageMeta.description ?? parentMeta?.description,
    breadcrumbTitle: parentMeta?.title,
    ogTitle: pageMeta.ogTitle ?? parentMeta?.ogTitle,
    title: `${pageMeta.title} - ${parentMeta?.title ?? ""}`,
  };
}

export const loader = async ({
  params,
  request,
  context,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);

  // get data from request
  const { pathname, searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") ?? undefined;
  const { flowId, stepId, arrayIndex } = parsePathname(pathname);
  const cookieId = request.headers.get("Cookie");

  // get data from redis
  const { data, id } = await getSessionForContext(flowId).getSession(cookieId);
  const flowContext: Context = data; // Recast for now to get type safety
  context.sessionId = getSessionForContext(flowId).getSessionId(id); // For showing in errors

  // get flow controller
  const currentFlow = flows[flowId];
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: flowContext,
    guards: currentFlow.guards,
  });

  // check funnel logic -> Vorabcheck + Formular?
  if (!returnTo && !flowController.isReachable(stepId))
    return redirectDocument(flowController.getInitial().url);

  // get migration data to display -> Formular
  // Not having data here could skip the migration step
  let migrationData: Record<string, unknown> = {};
  if (stepId === "intro/daten-uebernahme" && "migrationSource" in currentFlow)
    migrationData = await getMigrationData(flowId, currentFlow, cookieId);

  // get all relevant strapi data
  const pathNameWithoutArrayIndex = `/${flowId}/${stepId}`;
  const lookupPath = pathNameWithoutArrayIndex.includes("persoenliche-daten")
    ? pathNameWithoutArrayIndex.replace("fluggastrechte", "geld-einklagen")
    : pathNameWithoutArrayIndex;
  const [
    commonContent,
    formPageContent,
    parentMeta,
    translations,
    navTranslations,
  ] = await Promise.all([
    fetchSingleEntry("vorab-check-common"), // TODO replace with translations
    fetchCollectionEntry(currentFlow.cmsSlug, lookupPath),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchTranslations(flowId),
    fetchTranslations(`${flowId}/menu`),
  ]);

  // Inject heading into <legend> inside radio groups
  // TODO: only do for pages with *one* select?
  // TODO: We're not doing this for vorabcheck anymore -> revert acd2634b90b2edd95493fe140bd1c316a7b81ad8
  formPageContent.form.forEach(({ __component, label }, idx) => {
    if (
      __component === "form-elements.select" &&
      label === null &&
      "heading" in formPageContent
    ) {
      (formPageContent.form[idx] as StrapiSelect).altLabel =
        formPageContent.heading;
    }
  });

  // structure cms content -> merge with getting data?
  const cmsContent = structureCmsContent(formPageContent);

  // get meta content for step, used in breadcrumbs -> actually only Vorabcheck, *but* used in root.tsx
  const meta = stepMeta(formPageContent.meta, parentMeta);

  // get list of template replacements -> replace data placeholder in content directly here?
  const templateReplacements = {
    ...("stringReplacements" in currentFlow
      ? currentFlow.stringReplacements(flowContext)
      : {}),
  };

  // filter user data for current step
  const fieldNames = formPageContent.form.map((entry) => entry.name);
  const stepData = stepDataFromFieldNames(fieldNames, data, arrayIndex);

  // get array data to display in ArraySummary -> Formular + Vorabcheck?
  const arrayData: ArrayCollection = Object.fromEntries(
    formPageContent.pre_form.filter(isStrapiArraySummary).map((entry) => {
      const possibleArray = flowContext[entry.arrayKey];
      return [
        entry.arrayKey,
        Array.isArray(possibleArray) ? possibleArray : [],
      ];
    }),
  );

  // update session with csrf
  const csrf = createCSRFToken();
  const session = await csrfSessionFromRequest(csrf, request);

  // update session with last valid step
  session.set(lastStepKey, { [flowId]: stepId });

  // set session in header
  const sessionContext = getSessionForContext("main");
  const headers = { "Set-Cookie": await sessionContext.commitSession(session) };

  // get navigation destinations + labels
  const buttonNavigationProps = getButtonNavigationProps({
    commonContent,
    nextButtonLabel: cmsContent.nextButtonLabel,
    isFinal: flowController.isFinal(stepId),
    configMetadata: flowController.getMeta(stepId),
    previousStepUrl: flowController.getPrevious(stepId)?.url,
    returnTo,
  });

  // get navigation items -> Formular
  const navItems = navItemsFromFlowSpecifics(
    stepId,
    flowController,
    navTranslations,
  );

  // get progress -> Vorabcheck
  const progress = flowController.getProgress(stepId);

  return json(
    {
      csrf,
      defaultValues: stepData,
      arrayData,
      commonContent,
      ...cmsContent,
      meta,
      migrationData,
      translations,
      progress,
      templateReplacements,
      buttonNavigationProps,
      navItems,
      returnTo,
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

  const validator = buildStepValidator(
    getContext(flowId),
    Object.keys(relevantFormData),
  );
  const validationResult = await validator.validate(relevantFormData);
  if (validationResult.error)
    return validationError(
      validationResult.error,
      validationResult.submittedData,
    );
  updateSession(flowSession, validationResult.data, arrayIndex);

  if (
    stepId === "intro/daten-uebernahme" &&
    "migrationSource" in currentFlow &&
    validationResult.data["doMigration"] === "yes"
  ) {
    const migrationData = await getMigrationData(flowId, currentFlow, cookieId);
    updateSession(flowSession, migrationData);
  }

  const headers = { "Set-Cookie": await commitSession(flowSession) };

  const flowController = buildFlowController({
    config: flows[flowId].config,
    data: flowSession.data,
    guards: flows[flowId].guards,
  });

  const customEventName = flowController.getMeta(stepId)?.customEventName;
  if (customEventName)
    void sendCustomEvent(customEventName, validationResult.data, request);

  const returnTo = formData.get("_returnTo");
  const destination =
    returnTo && typeof returnTo === "string" && returnTo !== ""
      ? returnTo
      : flowController.getNext(stepId)?.url ?? flowController.getInitial().url;

  return redirectDocument(destination, { headers });
};
