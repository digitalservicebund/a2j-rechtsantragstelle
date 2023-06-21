import { useLoaderData, useLocation } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import {
  allValidators as beratungshilfeValidators,
  formPages as beratungshilfeFormPages,
} from "~/lib/vorabcheck/pages";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";
import type { StrapiVorabCheckPage } from "~/services/cms/models/StrapiVorabCheckPage";
import type { StrapiResultPage } from "~/services/cms/models/StrapiResultPage";
import ResultPage from "~/components/ResultPage";
import type { StrapiElementWithId } from "~/services/cms/models/StrapiElementWithId";
import { Background } from "~/components";
import ProgressBarArea from "~/components/form/ProgressBarArea";
import {
  getStrapiResultPage,
  getStrapiVorabCheckCommon,
  getStrapiVorabCheckPage,
} from "~/services/cms";
import { buildFlowController } from "~/services/flow/buildFlowController";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import geldEinklagenFlow from "~/models/flows/geldEinklagen/config.json";
import {
  isIncomeTooHigh,
  guards as beratungshilfeGuards,
} from "~/models/flows/beratungshilfe/guards";
import { guards as geldEinklagenGuards } from "~/models/flows/geldEinklagen/guards";
import invariant from "tiny-invariant";
import type { MachineConfig } from "xstate";
import { getInitialStep } from "~/services/flow/getInitialStep";
import { getVerfuegbaresEinkommenFreibetrag } from "~/models/beratungshilfe";
import {
  allValidators as geldEinklagenValidators,
  formPages as geldEinklagenFormPages,
} from "~/models/flows/geldEinklagen/pages";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data ? data.meta.title : location.pathname },
];

const getReasonsToDisplay = (
  reasons: { attributes: StrapiElementWithId }[] | null,
  context: any
) => {
  return reasons
    ?.filter((reason) => {
      // TODO use reusable conditions for this
      switch (reason.attributes.elementId) {
        case "eigeninitiativeWarning":
          return context.eigeninitiative?.hasHelpedThemselves == "no";
        case "incomeTooHigh":
          return (
            context.verfuegbaresEinkommen?.excessiveDisposableIncome ===
              "yes" || isIncomeTooHigh(context)
          );
        case "noKostenloseBeratung":
          return context.kostenfreieBeratung?.hasTriedFreeServices == "no";
        default:
          return false;
      }
    })
    .map((reason) => reason.attributes);
};

const guards = {
  beratungshilfe: beratungshilfeGuards,
  "geld-einklagen": geldEinklagenGuards,
};

const flowSpecifics = {
  beratungshilfe: {
    flow: beratungshilfeFlow,
    guards: beratungshilfeGuards,
    formPages: beratungshilfeFormPages,
    validators: geldEinklagenValidators,
  },
  "geld-einklagen": {
    flow: geldEinklagenFlow,
    guards: geldEinklagenGuards,
    formPages: geldEinklagenFormPages,
    validators: geldEinklagenValidators,
  },
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const pathname = new URL(request.url).pathname;
  const flowId = pathname.split("/")[1] as keyof typeof flowSpecifics;
  const flow = flowSpecifics[flowId].flow;

  if (splat === "") {
    // redirect to initial step
    return redirect(getInitialStep({ flow }).url);
  }

  const stepId = splat;

  const session = await getSession(request.headers.get("Cookie"));

  const flowController = buildFlowController({
    flow: flow as MachineConfig<any, any, any>,
    currentStepId: stepId,
    data: session.data,
    guards: flowSpecifics[flowId].guards,
  });

  if (!flowController.isReachable()) {
    return redirect(flowController.getInitial().url);
  }

  const currentPage = flowSpecifics[flowId].formPages[stepId];
  let slug = pathname.substring(1);
  let formPageContent: StrapiVorabCheckPage | undefined;
  let resultPageContent: StrapiResultPage | undefined;
  let resultReasonsToDisplay: StrapiElementWithId[] | undefined;
  if ("schema" in currentPage) {
    formPageContent = await getStrapiVorabCheckPage({ slug });
  } else {
    if (/AbschlussJa/.test(slug)) {
      slug = "abschlussJa";
    } else if (/AbschlussNein/.test(slug)) {
      slug = "abschlussNein";
    } else if (/AbschlussVielleicht/.test(slug)) {
      slug = "abschlussVielleicht";
    }
    resultPageContent = await getStrapiResultPage({ slug });
    resultReasonsToDisplay = getReasonsToDisplay(
      resultPageContent?.reasonings?.data,
      session.data
    );
  }
  const commonContent = await getStrapiVorabCheckCommon();

  const verfuegbaresEinkommenFreibetrag = getVerfuegbaresEinkommenFreibetrag(
    session.data
  );
  const templateReplacements = {
    verfuegbaresEinkommenFreibetrag: verfuegbaresEinkommenFreibetrag.toString(),
  };

  const progressBar = flowController.getProgress();

  return json({
    defaultValues: session.data[stepId],
    commonContent,
    preFormContent: formPageContent?.pre_form,
    formContent: formPageContent?.form,
    resultContent: resultPageContent,
    resultReasonsToDisplay,
    meta: formPageContent?.meta ?? resultPageContent?.meta,
    progressStep: progressBar.current,
    progressTotal: progressBar.total,
    isLast: flowController.isFinal(),
    previousStep: flowController.isInitial()
      ? undefined
      : flowController.getPrevious().url,
    templateReplacements,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const splat = params["*"];
  invariant(typeof splat !== "undefined");

  const pathname = new URL(request.url).pathname;
  const flowId = pathname.split("/")[1] as keyof typeof flowSpecifics;
  const stepId = splat;

  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const stepValidators = flowSpecifics[flowId].validators[stepId];
  const validationResult = await stepValidators.validate(formData);

  if (validationResult.error) return validationError(validationResult.error);

  session.set(stepId, validationResult.data);
  const headers = { "Set-Cookie": await commitSession(session) };

  const flowController = buildFlowController({
    flow: flowSpecifics[flowId].flow as MachineConfig<any, any, any>,
    currentStepId: stepId,
    data: session.data,
    guards: flowSpecifics[flowId].guards,
  });
  return redirect(flowController.getNext().url, { headers });
};

export function Step() {
  const {
    defaultValues,
    commonContent,
    preFormContent,
    formContent,
    resultContent,
    resultReasonsToDisplay,
    progressStep,
    progressTotal,
    isLast,
    previousStep,
    templateReplacements,
  } = useLoaderData<typeof loader>();
  const location = useLocation();
  const stepId = location.pathname.split("/").at(-1);
  const flowId = location.pathname.split("/")[1] as keyof typeof flowSpecifics;
  const validator = flowSpecifics[flowId].validators[stepId as string];

  if (resultContent) {
    return (
      <ResultPage
        content={{ ...resultContent, ...commonContent }}
        backDestination={previousStep}
        reasonsToDisplay={resultReasonsToDisplay}
        progressStep={progressStep}
        progressTotal={progressTotal}
        isLast={isLast}
      />
    );
  } else if (preFormContent && formContent) {
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
                    <PageContent
                      content={formContent}
                      defaultValues={defaultValues}
                    />
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
}
