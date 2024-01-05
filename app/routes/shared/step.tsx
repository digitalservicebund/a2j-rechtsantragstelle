import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { getSessionForContext, updateSession } from "~/services/session";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";
import Background from "~/components/Background";
import { ProgressBar } from "~/components/form/ProgressBar";
import {
  fetchCollectionEntry,
  fetchMeta,
  fetchSingleEntry,
} from "~/services/cms/index.server";
import { buildFlowController } from "~/services/flow/buildFlowController";
import { type AllContexts, buildStepValidator } from "~/models/flows/common";
import {
  flowIDFromPathname,
  flowSpecifics,
  getSubflowsEntries,
  parentFromParams,
  splatFromParams,
} from "./flowSpecifics";
import type { StrapiHeading } from "~/services/cms/models/StrapiHeading";
import type { StrapiSelect } from "~/services/cms/models/StrapiSelect";
import {
  createCSRFToken,
  csrfSessionFromRequest,
  validatedSession,
} from "~/services/security/csrf.server";
import { CSRFKey } from "~/services/security/csrfKey";
import { throw404IfFeatureFlagEnabled } from "~/services/errorPages/throw404";
import { logError } from "~/services/logging";
import { lastStepKey } from "~/services/flow/lastStep";
import { fillTemplate } from "~/util/fillTemplate";
import Heading from "~/components/Heading";
import MigrationDataOverview from "~/components/MigrationDataOverview";
import { getMigrationData } from "~/services/session/crossFlowMigration";
import FlowNavigation from "~/components/FlowNavigation";
import { navItemsFromFlowSpecifics } from "~/services/flowNavigation";
import type { z } from "zod";
import type { CollectionSchemas } from "~/services/cms/schemas";
import { getButtonNavigationProps } from "~/util/getButtonNavigationProps";
import { sendCustomEvent } from "~/services/analytics/customEvent";

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
  const currentFlow = flowSpecifics[flowId];
  const flowController = buildFlowController({
    flow: currentFlow.flow,
    data: flowContext,
    guards: currentFlow.guards,
  });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial().url);

  // Not having data here could skip the migration step
  let migrationData: Record<string, unknown> = {};
  if (stepId === "intro/daten-uebernahme" && "migrationSource" in currentFlow)
    migrationData = await getMigrationData(currentFlow, cookieId);

  const lookupPath = pathname.includes("persoenliche-daten")
    ? pathname.replace("fluggastrechte", "geld-einklagen")
    : pathname;

  const [commonContent, formPageContent, parentMeta] = await Promise.all([
    fetchSingleEntry("vorab-check-common"),
    fetchCollectionEntry(currentFlow.cmsSlug, lookupPath),
    fetchMeta({ filterValue: parentFromParams(pathname, params) }),
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
  const navigationLabels = Object.fromEntries(
    await Promise.all(
      getSubflowsEntries(currentFlow.flow).map(([subflowName]) =>
        fetchMeta({ filterValue: `/${flowId}/${subflowName}` }).then(
          (meta) => [subflowName, meta?.title ?? ""] as [string, string],
        ),
      ),
    ),
  );

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
        navigationLabels,
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
  const currentFlow = flowSpecifics[flowId];

  // Note: This also reduces same-named fields to the last entry
  const relevantFormData = Object.fromEntries(
    Array.from(formData.entries()).filter(([key]) => !key.startsWith("_")),
  );
  const validator = buildStepValidator(
    currentFlow.context,
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
    updateSession(flowSession, await getMigrationData(currentFlow, cookieId));
  }

  const headers = { "Set-Cookie": await commitSession(flowSession) };

  const flowController = buildFlowController({
    flow: flowSpecifics[flowId].flow,
    data: flowSession.data,
    guards: flowSpecifics[flowId].guards,
  });

  const customEventName = flowController.getMeta(stepId)?.customEventName;
  if (customEventName)
    void sendCustomEvent(customEventName, validationResult.data, request);

  return redirect(flowController.getNext(stepId).url, { headers });
};

export function StepWithProgressBar() {
  const {
    csrf,
    defaultValues,
    commonContent,
    content,
    formContent,
    progress,
    templateReplacements,
    buttonNavigationProps,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const { pathname } = useLocation();
  const flowId = flowIDFromPathname(pathname);
  const { context } = flowSpecifics[flowId];
  const fieldNames = formContent.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container paddingTop="24" paddingBottom="64">
          <div className="ds-stack-16">
            <ProgressBar
              label={commonContent.progressBarLabel}
              progress={progress.current}
              max={progress.total}
            />
            <div className="ds-stack-40">
              <PageContent
                content={content}
                templateReplacements={templateReplacements}
                className="ds-stack-16"
              />
              <ValidatedForm
                id={`${stepId}_form`}
                method="post"
                validator={validator}
                defaultValues={defaultValues}
                noValidate
                action={pathname}
              >
                <input type="hidden" name={CSRFKey} value={csrf} />
                <div className="ds-stack-40">
                  <PageContent content={formContent} className="ds-stack-40" />
                  <ButtonNavigation {...buttonNavigationProps} />
                </div>
              </ValidatedForm>
            </div>
          </div>
        </Container>
      </div>
    </Background>
  );
}

export function StepWithPreHeading() {
  const {
    csrf,
    defaultValues,
    heading,
    preHeading,
    content,
    formContent,
    postFormContent,
    migrationData,
    templateReplacements,
    buttonNavigationProps,
    navItems,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const { pathname } = useLocation();
  const flowId = flowIDFromPathname(pathname);
  const { context } = flowSpecifics[flowId];
  const fieldNames = formContent.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  return (
    <Background backgroundColor="blue">
      <div className="pt-32 min-h-screen flex flex-col-reverse justify-end md:flex-wrap md:flex-row md:justify-start">
        {navItems && (
          <div className="pb-48 md:pt-[1.4rem] md:shrink-0 md:grow md:min-w-[max-content] md:max-w-[calc(50vw_-_29.5rem)] md:flex md:justify-end">
            <FlowNavigation navItems={navItems} />
          </div>
        )}
        <div
          className={`ds-stack-40 container md:flex-1 ${navItems && "!ml-0"}`}
        >
          <div className="ds-stack-16">
            {preHeading && (
              <p className="ds-label-01-bold">
                {fillTemplate({
                  template: preHeading,
                  replacements: templateReplacements,
                })}
              </p>
            )}
            <Heading
              text={fillTemplate({
                template: heading ?? "",
                replacements: templateReplacements,
              })}
              look="ds-heading-02-reg"
            />
            <PageContent
              content={content}
              templateReplacements={templateReplacements}
              className="ds-stack-16"
            />
          </div>

          <MigrationDataOverview migrationData={migrationData} />
          <ValidatedForm
            id={`${stepId}_form`}
            method="post"
            validator={validator}
            defaultValues={defaultValues}
            noValidate
            action={pathname}
          >
            <input type="hidden" name={CSRFKey} value={csrf} />
            <div className="ds-stack-40">
              {formContent && formContent.length != 0 && (
                <PageContent content={formContent} className="ds-stack-40" />
              )}
              {postFormContent && postFormContent.length != 0 && (
                <PageContent content={postFormContent} />
              )}
              <ButtonNavigation {...buttonNavigationProps} />
            </div>
          </ValidatedForm>
        </div>
      </div>
    </Background>
  );
}
