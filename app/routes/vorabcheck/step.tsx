import { useLoaderData, useLocation, useParams } from "@remix-run/react";
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
import ProgressBarArea from "~/components/form/ProgressBarArea";
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

  const commonContent = await getStrapiVorabCheckCommon();
  const progressBar = flowController.getProgress(stepId);
  const defaultValues = data;
  const progressStep = progressBar.current;
  const progressTotal = progressBar.total;
  const isLast = flowController.isFinal(stepId);
  const previousStep = flowController.isInitial(stepId)
    ? undefined
    : flowController.getPrevious(stepId).url;
  const formPageContent = await getStrapiVorabCheckPage({ slug: pathname });

  return json({
    defaultValues,
    commonContent,
    preFormContent: formPageContent.pre_form,
    formContent: formPageContent.form,
    meta: formPageContent.meta,
    progressStep,
    progressTotal,
    isLast,
    previousStep,
    templateReplacements,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const stepId = splatFromParams(params);
  const flowId = flowIDFromPathname(new URL(request.url).pathname);
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const { context } = flowSpecifics[flowId];

  const fieldNames = Array.from(formData.entries())
    .filter(([key]) => key !== "_action")
    .map((entry) => entry.at(0) as string);

  const validator = buildStepValidator(context, fieldNames);
  const validationResult = await validator.validate(formData);
  if (validationResult.error) return validationError(validationResult.error);

  Object.entries(validationResult.data as Record<string, string>).forEach(
    ([key, data]) => session.set(key, data)
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
    progressStep,
    progressTotal,
    isLast,
    previousStep,
    templateReplacements,
  } = useLoaderData<typeof loader>();
  const stepId = splatFromParams(useParams());
  const flowId = flowIDFromPathname(useLocation().pathname);
  const { context } = flowSpecifics[flowId];
  const fieldNames = formContent.map((entry) => entry.name);
  const validator = buildStepValidator(context, fieldNames);

  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container>
          <div className="ds-stack-16">
            <ProgressBarArea
              label={commonContent?.progressBarLabel}
              progressStep={progressStep}
              progressTotal={progressTotal}
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
                <div className="ds-stack-40">
                  <PageContent content={formContent} />
                  <ButtonNavigation
                    backDestination={previousStep}
                    isLast={isLast}
                    commonContent={commonContent}
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
