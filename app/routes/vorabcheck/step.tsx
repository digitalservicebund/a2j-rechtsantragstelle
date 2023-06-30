import { useLoaderData, useLocation } from "@remix-run/react";
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
import invariant from "tiny-invariant";
import type { MachineConfig } from "xstate";
import { getVerfuegbaresEinkommenFreibetrag } from "~/models/beratungshilfe";
import { isKeyOfObject } from "~/util/objects";
import { buildStepValidator } from "~/models/flows/common";
import { flowSpecifics } from "./flowSpecifics";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta?.title ?? location.pathname },
];

export const loader = async ({ params, request }: LoaderArgs) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const pathname = new URL(request.url).pathname;
  const flowId = pathname.split("/")[1] as keyof typeof flowSpecifics;
  const flow = flowSpecifics[flowId].flow;

  if (splat === "") {
    // redirect to initial step
    return redirect(buildFlowController({ flow }).getInitial().url);
  }

  const stepId = splat;

  const session = await getSession(request.headers.get("Cookie"));

  const flowController = buildFlowController({
    flow: flow as MachineConfig<any, any, any>,
    data: session.data,
    guards: flowSpecifics[flowId].guards,
  });

  if (!flowController.isReachable(stepId)) {
    return redirect(flowController.getInitial().url);
  }

  const verfuegbaresEinkommenFreibetrag = getVerfuegbaresEinkommenFreibetrag(
    session.data
  );
  const templateReplacements = {
    verfuegbaresEinkommenFreibetrag: verfuegbaresEinkommenFreibetrag.toString(),
  };

  const commonContent = await getStrapiVorabCheckCommon();
  const progressBar = flowController.getProgress(stepId);
  const defaultValues = session.data;
  const progressStep = progressBar.current;
  const progressTotal = progressBar.total;
  const isLast = flowController.isFinal(stepId);
  const previousStep = flowController.isInitial(stepId)
    ? undefined
    : flowController.getPrevious(stepId).url;

  const slug = pathname;
  const formPageContent = await getStrapiVorabCheckPage({ slug });

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
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const pathname = new URL(request.url).pathname;
  const flowId = pathname.split("/")[1];
  const stepId = splat;

  if (!isKeyOfObject(flowId, flowSpecifics)) {
    throw new Response(null, {
      status: 404,
      statusText: "Unknown Flow",
    });
  }

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
    flow: flowSpecifics[flowId].flow as MachineConfig<any, any, any>,
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
  const location = useLocation();

  const stepId = location.pathname.split("/").at(-1);
  const flowId = location.pathname.split("/")[1];
  if (!isKeyOfObject(flowId, flowSpecifics)) {
    throw Error("Unkown flow");
  }
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
