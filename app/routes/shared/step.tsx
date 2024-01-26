import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { getSessionForContext, updateSession } from "~/services/session.server";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchSingleEntry,
  fetchTranslations,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/server/buildFlowController";
import { type AllContexts, buildStepValidator } from "~/models/flows/common";
import { getContext, flowIDFromPathname } from "~/models/flows/contexts";
import { flows } from "~/models/flows/flows.server";
import type { StrapiHeading } from "~/services/cms/models/StrapiHeading";
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
import { navItemsFromFlowSpecifics } from "~/services/flowNavigation";
import type { z } from "zod";
import type { CollectionSchemas } from "~/services/cms/schemas";
import { getButtonNavigationProps } from "~/util/getButtonNavigationProps";
import { sendCustomEvent } from "~/services/analytics/customEvent";
import { parentFromParams, splatFromParams } from "~/services/params";

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
export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  await throw404IfFeatureFlagEnabled(request);
  const stepId = splatFromParams(params);
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const cookieId = request.headers.get("Cookie");
  const { data, id } = await getSessionForContext(flowId).getSession(cookieId);
  const flowContext: AllContexts = data; // Recast for now to get type safety
  context.sessionId = getSessionForContext(flowId).getSessionId(id); // For showing in errors
  const currentFlow = flows[flowId];
  const flowController = buildFlowController({
    config: currentFlow.config,
    data: flowContext,
    guards: currentFlow.guards,
  });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial().url);

  // Not having data here could skip the migration step
  let migrationData: Record<string, unknown> = {};
  if (stepId === "intro/daten-uebernahme" && "migrationSource" in currentFlow)
    migrationData = await getMigrationData(flowId, currentFlow, cookieId);

  const lookupPath = pathname.includes("persoenliche-daten")
    ? pathname.replace("fluggastrechte", "geld-einklagen")
    : pathname;

  const [
    commonContent,
    formPageContent,
    parentMeta,
    translations,
    navTranslations,
  ] = await Promise.all([
    fetchSingleEntry("vorab-check-common"),
    fetchCollectionEntry(currentFlow.cmsSlug, lookupPath),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
    fetchTranslations(flowId),
    fetchTranslations(`${flowId}/menu`),
  ]);

  // To add a <legend> inside radio groups, we extract the text from the first <h1> and replace any null labels with it
  const mainHeading = formPageContent.pre_form.filter(
    (component) =>
      component.__component === "basic.heading" && component.tagName === "h1",
  ) as StrapiHeading[];
  const formLegend = mainHeading.length > 0 ? mainHeading[0].text : null;

  formPageContent.form.forEach(({ __component, label }, idx) => {
    if (__component === "form-elements.select" && label === null) {
      (formPageContent.form[idx] as StrapiSelect).altLabel = formLegend;
    }
  });

  const csrf = createCSRFToken();
  const sessionContext = getSessionForContext("main");
  const session = await csrfSessionFromRequest(csrf, request);
  session.set(lastStepKey, { [flowId]: stepId });
  const headers = { "Set-Cookie": await sessionContext.commitSession(session) };

  // The breadcrumb should not contain the current step title
  // Also, the parent page title needs to be appended manually to the title
  const meta = {
    description: formPageContent.meta.description ?? parentMeta?.description,
    breadcrumbTitle: parentMeta?.title,
    ogTitle: formPageContent.meta.ogTitle ?? parentMeta?.ogTitle,
    title: `${formPageContent.meta.title} - ${parentMeta?.title ?? ""}`,
  };

  const cmsContent = structureCmsContent(formPageContent);

  const buttonNavigationProps = getButtonNavigationProps({
    commonContent,
    nextButtonLabel: cmsContent.nextButtonLabel,
    isFinal: flowController.isFinal(stepId),
    configMetadata: flowController.getMeta(stepId),
    previousStepUrl: flowController.getPrevious(stepId)?.url,
  });

  return json(
    {
      csrf,
      defaultValues: data as Record<string, string>,
      commonContent,
      ...cmsContent,
      meta,
      migrationData,
      translations,
      progress: flowController.getProgress(stepId),
      templateReplacements: {
        ...("stringReplacements" in currentFlow
          ? currentFlow.stringReplacements(flowContext)
          : {}),
      },
      buttonNavigationProps,
      navItems: navItemsFromFlowSpecifics(
        stepId,
        flowController,
        navTranslations,
      ),
    },
    { headers },
  );
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  try {
    await validatedSession(request);
  } catch (csrfError) {
    logError({ error: csrfError });
    throw new Response(null, { status: 403 });
  }
  const stepId = splatFromParams(params);
  const flowId = flowIDFromPathname(new URL(request.url).pathname);
  const { getSession, commitSession } = getSessionForContext(flowId);
  const cookieId = request.headers.get("Cookie");
  const flowSession = await getSession(cookieId);

  const formData = await request.formData();
  const currentFlow = flows[flowId];

  // Note: This also reduces same-named fields to the last entry
  const relevantFormData = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith("_")),
  );
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

  updateSession(flowSession, validationResult.data);

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

  return redirect(flowController.getNext(stepId).url, { headers });
};
