import { useLoaderData, useParams } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import { allValidators, formPages } from "~/lib/vorabcheck/pages";
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
import getSlug from "~/util/getSlug";

import { buildFlowController } from "~/services/flow/buildFlowController";
import beratungshilfeFlow from "~/models/flows/beratungshilfe/config.json";
import {
  isIncomeTooHigh,
  guards as beratungshilfeGuards,
} from "~/models/flows/beratungshilfe/guards";
import invariant from "tiny-invariant";
import type { MachineConfig } from "xstate";

export const meta: V2_MetaFunction<typeof loader> = ({ data, location }) => [
  { title: data?.meta?.title ?? location.pathname },
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

export const loader = async ({ params, request }: LoaderArgs) => {
  const stepId = params.stepId;
  invariant(stepId);

  const session = await getSession(request.headers.get("Cookie"));

  const flowController = buildFlowController({
    flow: beratungshilfeFlow as MachineConfig<any, any, any>,
    currentStepId: stepId,
    data: session.data,
    guards: beratungshilfeGuards,
  });

  if (!flowController.isReachable()) {
    return redirect(flowController.getInitial().url);
  }

  const currentPage = formPages[stepId];
  let slug = getSlug(request.url);
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

  // The additional context is used by steps to request other context context variables
  // Currently used in verfuegbaresEinkommen to calculate a value at runtime based on previous answers
  let additionalContext = {};
  if ("additionalContext" in currentPage && currentPage["additionalContext"]) {
    for (const requestedContext of currentPage["additionalContext"]) {
      // Use .find(), since answers are nested below stepId and there is no fast lookup by name alone
      additionalContext = {
        ...additionalContext,
        ...Object.values(session.data).find((el) => requestedContext in el),
      };
    }
  }

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
    additionalContext,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const stepId = params.stepId;
  invariant(stepId);

  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const validationResult = await allValidators[stepId].validate(formData);

  if (validationResult.error) return validationError(validationResult.error);

  session.set(stepId, validationResult.data);
  const headers = { "Set-Cookie": await commitSession(session) };

  const flowController = buildFlowController({
    flow: beratungshilfeFlow as MachineConfig<any, any, any>,
    currentStepId: stepId,
    data: session.data,
    guards: beratungshilfeGuards,
  });
  return redirect(flowController.getNext().url, { headers });
};

export default function Index() {
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
    additionalContext,
  } = useLoaderData<typeof loader>();
  const params = useParams();
  const stepId = params.stepId as string;
  const FormInputComponent = formPages[stepId].component;

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
                <PageContent content={preFormContent} className="ds-stack-16" />
                <ValidatedForm
                  key={`${stepId}_form`}
                  method="post"
                  validator={allValidators[stepId]}
                  noValidate
                >
                  <div className="ds-stack-40">
                    <FormInputComponent
                      content={formContent}
                      additionalContext={additionalContext}
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
