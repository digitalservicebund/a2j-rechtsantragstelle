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
import invariant from "tiny-invariant";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title: data.meta?.title },
];

const initialstepID = getInitialStep();

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
  const stepID = params.stepID?.replace("#", "");
  if (!hasStep(stepID) || stepID === undefined) {
    return redirect(`/vorabcheck/${initialstepID}`);
  }

  const session = await getSession(request.headers.get("Cookie"));

  const currentPage = formPages[stepID];
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
  if ("additionalContext" in currentPage && currentPage["additionalContext"]) {
    for (const requestedContext of currentPage["additionalContext"]) {
      // Use .find(), since answers are nested below stepID and there is no fast lookup by name alone
      additionalContext = {
        ...additionalContext,
        ...Object.values(session.data).find((el) => requestedContext in el),
      };
    }
  }

  const progressBar = getProgressBar(stepID, session.data);

  return json({
    defaultValues: session.data[stepID],
    commonContent,
    preFormContent: formPageContent?.pre_form,
    formContent: formPageContent?.form,
    resultContent: resultPageContent,
    resultReasonsToDisplay,
    meta: formPageContent?.meta || resultPageContent?.meta,
    progressStep: progressBar.current,
    progressTotal: progressBar.total,
    isLast: isLastStep(stepID),
    previousStep: getPreviousStep(stepID, session.data),
    additionalContext,
  });
};

export const action: ActionFunction = async ({ params, request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const stepID = params.stepID;
  invariant(typeof stepID !== "undefined", "stepId has to be provided");
  const validationResult = await allValidators[stepID].validate(formData);

  if (validationResult.error) return validationError(validationResult.error);

  session.set(stepID, validationResult.data);
  const headers = { "Set-Cookie": await commitSession(session) };

  let destinationString = getNextStep(stepID, session.data);
  return redirect(`/vorabcheck/${String(destinationString)}`, {
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
  const stepID = params.stepID as string;
  const FormInputComponent = formPages[stepID].component;

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
                key={`${stepID}_form`}
                method="post"
                validator={allValidators[stepID]}
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
