import {
  useLoaderData,
  useLocation,
  useParams,
  useRouteLoaderData,
} from "@remix-run/react";
import type {
  ActionFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";
import { Background } from "~/components";
import { ProgressBar } from "~/components/form/ProgressBar";
import {
  getStrapiVorabCheckCommon,
  getStrapiVorabCheckPage,
} from "~/services/cms";
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
import { validatedSession } from "~/services/security/csrf.server";
import { CSRFKey, csrfFromRouteLoader } from "~/services/security/csrf";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta?.title ?? location.pathname },
];

export const loader = async ({ params, request }: LoaderArgs) => {
  const stepId = splatFromParams(params);
  const { pathname } = new URL(request.url);
  const flowId = flowIDFromPathname(pathname);
  const flow = flowSpecifics[flowId].flow;

  const { data } = await getSession(request.headers.get("Cookie"));
  const flowController = buildFlowController({
    flow: flow,
    data: data,
    guards: flowSpecifics[flowId].guards,
  });

  if (!flowController.isReachable(stepId))
    return redirect(flowController.getInitial().url);

  const verfuegbaresEinkommenFreibetrag =
    getVerfuegbaresEinkommenFreibetrag(data);
  const templateReplacements = {
    verfuegbaresEinkommenFreibetrag: verfuegbaresEinkommenFreibetrag.toString(),
  };

  const formPageContent = await getStrapiVorabCheckPage({ slug: pathname });

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

  return json({
    defaultValues: data,
    commonContent: await getStrapiVorabCheckCommon(),
    preFormContent: formPageContent.pre_form,
    formContent: formPageContent.form,
    meta: formPageContent.meta,
    progress: flowController.getProgress(stepId),
    isLast: flowController.isFinal(stepId),
    previousStep: flowController.getPrevious(stepId)?.url,
    templateReplacements,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const session = await validatedSession(request);
  if (session === undefined) return redirect("/"); //TODO: how to handle failure?

  const stepId = splatFromParams(params);
  const flowId = flowIDFromPathname(new URL(request.url).pathname);
  const formData = await request.formData();
  const { context } = flowSpecifics[flowId];

  const fieldNames = Array.from(formData.entries())
    .filter(([key]) => key !== "_action" && key !== CSRFKey)
    .map((entry) => entry.at(0) as string);

  const validator = buildStepValidator(context, fieldNames);
  const validationResult = await validator.validate(formData);
  if (validationResult.error) return validationError(validationResult.error);

  Object.entries(validationResult.data as Record<string, string>).forEach(
    ([key, data]) => session.set(key, data),
  );
  const headers = { "Set-Cookie": await commitSession(session) };

  const flowController = buildFlowController({
    flow: flowSpecifics[flowId].flow,
    data: session.data,
    guards: flowSpecifics[flowId].guards,
  });
  return redirect(flowController.getNext(stepId).url, { headers });
};

export function Step() {
  const {
    defaultValues,
    commonContent,
    preFormContent,
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
                content={preFormContent}
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
                <input
                  type="hidden"
                  name={CSRFKey}
                  value={csrfFromRouteLoader(useRouteLoaderData("root"))}
                />
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
