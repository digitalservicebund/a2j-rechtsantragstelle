import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { getSessionForContext } from "~/services/session";
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
import { getVerfuegbaresEinkommenFreibetrag } from "~/models/beratungshilfe";
import { buildStepValidator } from "~/models/flows/common";
import {
  flowIDFromPathname,
  flowSpecifics,
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
import { getGerichtskostenvorschuss } from "~/models/geldEinklagen";

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
  context.sessionId = getSessionForContext(flowId).getSessionId(id); // For showing in errors
  const { flow, guards } = flowSpecifics[flowId];
  const flowController = buildFlowController({ flow, data, guards });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial().url);

  const verfuegbaresEinkommenFreibetrag =
    getVerfuegbaresEinkommenFreibetrag(data);
  const gerichtskostenvorschuss = getGerichtskostenvorschuss(data);

  const templateReplacements = {
    verfuegbaresEinkommenFreibetrag: verfuegbaresEinkommenFreibetrag.toString(),
    gerichtskostenvorschuss: gerichtskostenvorschuss.toString(),
  };

  const [commonContent, formPageContent, parentMeta] = await Promise.all([
    fetchSingleEntry("vorab-check-common"),
    fetchCollectionEntry(
      pathname.startsWith("/geld-einklagen/formular")
        ? "form-flow-pages"
        : "vorab-check-pages",
      pathname,
    ),
    fetchMeta({ slug: pathname.substring(0, pathname.lastIndexOf("/")) }),
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
  const headers = { "Set-Cookie": await sessionContext.commitSession(session) };

  // The breadcrumb should not contain the current step title
  // Also, the parent page title needs to be appended manually to the title
  const meta = {
    description: formPageContent.meta.description ?? parentMeta.description,
    breadcrumbTitle: parentMeta.title,
    ogTitle: formPageContent.meta.ogTitle ?? parentMeta.ogTitle,
    title: `${formPageContent.meta.title} - ${parentMeta.title}`,
  };

  return json(
    {
      csrf,
      defaultValues: data as Record<string, string>,
      commonContent,
      heading:
        "heading" in formPageContent ? formPageContent.heading : undefined,
      content: formPageContent.pre_form,
      formContent: formPageContent.form,
      meta,
      progress: flowController.getProgress(stepId),
      isLast: flowController.isFinal(stepId),
      previousStep: flowController.getPrevious(stepId)?.url,
      templateReplacements,
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
  const flowSession = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const { context } = flowSpecifics[flowId];

  const fieldNames = Array.from(formData.entries())
    .filter(([key]) => key !== "_action" && key !== CSRFKey)
    .map((entry) => entry.at(0) as string);

  const validator = buildStepValidator(context, fieldNames);
  const validationResult = await validator.validate(formData);
  if (validationResult.error) return validationError(validationResult.error);

  Object.entries(validationResult.data as Record<string, string>).forEach(
    ([key, data]) => flowSession.set(key, data),
  );
  const headers = { "Set-Cookie": await commitSession(flowSession) };

  const flowController = buildFlowController({
    flow: flowSpecifics[flowId].flow,
    data: flowSession.data,
    guards: flowSpecifics[flowId].guards,
  });
  return redirect(flowController.getNext(stepId).url, { headers });
};

export function Step() {
  const {
    csrf,
    defaultValues,
    commonContent,
    content,
    formContent,
    progress,
    isLast,
    previousStep,
    templateReplacements,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const flowId = flowIDFromPathname(useLocation().pathname);
  const { context } = flowSpecifics[flowId];
  const fieldNames = formContent.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  const nextLabel = isLast
    ? commonContent.lastNextButtonLabel
    : commonContent.nextButtonDefaultLabel;

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container paddingTop="24">
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
                key={`${stepId}_form`}
                method="post"
                validator={validator}
                defaultValues={defaultValues}
                noValidate
                action={stepId}
              >
                <input type="hidden" name={CSRFKey} value={csrf} />
                <div className="ds-stack-40">
                  <PageContent content={formContent} />
                  <ButtonNavigation
                    back={{
                      destination: previousStep,
                      label: commonContent.backButtonDefaultLabel,
                    }}
                    next={{ label: nextLabel }}
                  />
                </div>
              </ValidatedForm>
            </div>
          </div>
        </Container>
      </div>
    </Background>
  );
}
