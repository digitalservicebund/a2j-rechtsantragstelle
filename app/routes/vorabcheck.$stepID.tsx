import { useLoaderData, useParams } from "@remix-run/react";
import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ValidatedForm, validationError } from "remix-validated-form";
import { allValidators, formPages } from "~/lib/vorabcheck/pages";
import { ButtonNavigation } from "~/components/form/ButtonNavigation";
import { commitSession, getSession } from "~/sessions";
import {
  getResultPageConfig,
  getVorabCheckPageConfig,
} from "~/services/cms/getPageConfig";
import PageContent from "~/components/PageContent";
import Container from "~/components/Container";
import type { VorabcheckPage } from "~/services/cms/models/VorabcheckPage";
import type { ResultPage as ResultPageContent } from "~/services/cms/models/ResultPage";
import ResultPage from "~/components/ResultPage";
import type { ElementWithId } from "~/services/cms/models/ElementWithId";
import { Background } from "~/components";
import ProgressBarArea from "~/components/form/ProgressBarArea";
import type { VorabCheckCommons } from "~/services/cms/models/commons/VorabCheckCommons";
import cms from "~/services/cms";

import {
  getInitialStep,
  getNextStep,
  getPreviousStep,
  getProgressBar,
  hasStep,
  isLastStep,
} from "~/services/flow";
import { isIncomeTooHigh } from "~/services/flow/guards";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.meta?.title },
];

const initialstepId = getInitialStep();

const getReasonsToDisplay = (
  reasons: { attributes: ElementWithId }[] | undefined,
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

export const loader: LoaderFunction = async ({ params, request }) => {
  const stepId = params.stepId?.replace("#", "");
  if (!hasStep(stepId) || stepId === undefined) {
    return redirect(`/vorabcheck/${initialstepId}`);
  }

  const session = await getSession(request.headers.get("Cookie"));

  const currentPage = formPages[stepId];
  let formPageContent: VorabcheckPage | undefined;
  let resultPageContent: ResultPageContent | undefined;
  let resultReasonsToDisplay: ElementWithId[] | undefined;
  if ("schema" in currentPage) {
    formPageContent = await getVorabCheckPageConfig(request.url);
  } else {
    resultPageContent = await getResultPageConfig(request.url);
    resultReasonsToDisplay = getReasonsToDisplay(
      resultPageContent?.reasonings?.data,
      session.data
    );
  }
  const commonContent: VorabCheckCommons = await cms().getPage(
    "vorab-check-common"
  );

  let additionalContext = {};
  if ("additionalContext" in currentPage) {
    for (const requestedContext of currentPage["additionalContext"]) {
      // Use .find(), since answers are nested below stepId and there is no fast lookup by name alone
      additionalContext = {
        ...additionalContext,
        ...Object.values(session.data).find((el) => requestedContext in el),
      };
    }
  }

  const progressBar = getProgressBar(stepId, session.data);

  return json({
    defaultValues: session.data[stepId],
    commonContent,
    preFormContent: formPageContent?.pre_form,
    formContent: formPageContent?.form,
    resultContent: resultPageContent,
    resultReasonsToDisplay,
    meta: formPageContent?.meta || resultPageContent?.meta,
    progressStep: progressBar.current,
    progressTotal: progressBar.total,
    isLast: isLastStep(stepId),
    previousStep: getPreviousStep(stepId, session.data),
    additionalContext,
  });
};
export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const stepId = params.stepId as string;
  const validationResult = await allValidators[stepId].validate(formData);

  if (validationResult.error) return validationError(validationResult.error);

  session.set(stepId, validationResult.data);
  const headers = { "Set-Cookie": await commitSession(session) };

  let destinationString = getNextStep(stepId, session.data);
  return redirect(`/vorabcheck/${String(destinationString)}`, {
    status: 302,
    headers,
  });
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
  const stepProgress = progressStep;
  const params = useParams();
  const stepId = params.stepId as string;
  const FormInputComponent = formPages[stepId].component;

  if (resultContent) {
    return (
      <ResultPage
        content={{ ...resultContent, ...commonContent }}
        backDestination={previousStep}
        reasonsToDisplay={resultReasonsToDisplay}
        stepProgress={stepProgress}
        progressTotal={progressTotal}
        isLast={isLast}
      />
    );
  }
  return (
    <Background backgroundColor="blue">
      <div className="min-h-screen">
        <Container>
          <div className="ds-stack-16">
            <ProgressBarArea
              label={commonContent?.progressBarLabel}
              stepProgress={stepProgress}
              progressTotal={progressTotal}
            />
            <div className="ds-stack-40">
              <PageContent content={preFormContent} className="ds-stack-16" />
              <ValidatedForm
                key={`${stepId}_form`}
                method="post"
                validator={allValidators[stepId]}
                defaultValues={defaultValues}
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
