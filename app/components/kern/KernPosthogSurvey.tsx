import ErrorOutline from "@digitalservicebund/icons/ErrorOutline";
import classNames from "classnames";
import { type Survey, SurveyQuestionType } from "posthog-js";
import { type ElementType, useEffect, useRef, useState } from "react";
import ButtonContainer from "~/components/common/ButtonContainer";
import { MultipleChoiceQuestion } from "~/components/reportProblem/MultipleChoiceQuestion";
import {
  OpenQuestion,
  type SurveyResponses,
} from "~/components/reportProblem/OpenQuestion";
import { isCompleted } from "~/services/analytics/surveys/isCompleted";
import { translations } from "~/services/translations/translations";
import KernButton from "./KernButton";

type KernPosthogSurveyProps = {
  survey: Pick<Survey, "id" | "questions">;
  wasSubmitted: boolean;
  submitFeedback: (responses: SurveyResponses) => void;
  closeSurvey: () => void;
  // Marked as optional for ease of storybook mocking
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
};

const questionTypes: Record<string, ElementType> = {
  [SurveyQuestionType.Open]: OpenQuestion,
  [SurveyQuestionType.MultipleChoice]: MultipleChoiceQuestion,
  [SurveyQuestionType.SingleChoice]: () => <></>,
  [SurveyQuestionType.Rating]: () => <></>,
  [SurveyQuestionType.Link]: () => <></>,
};

export const KernPosthogSurvey = ({
  survey,
  wasSubmitted,
  submitFeedback,
  closeSurvey,
  dialogRef,
}: KernPosthogSurveyProps) => {
  const [responses, setResponses] = useState<SurveyResponses>();
  const [showValidationError, setShowValidationError] = useState(false);
  const isCompletelyFilled = isCompleted(survey, responses);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const onSubmitClicked = () => {
    if (responses && isCompletelyFilled) {
      submitFeedback(responses);
      setResponses(undefined);
      setShowValidationError(false);
    } else {
      setShowValidationError(true);
    }
  };

  useEffect(() => {
    if (wasSubmitted) {
      closeButtonRef.current?.focus();
    }
  }, [wasSubmitted]);

  useEffect(() => {
    if (showValidationError && responses && isCompletelyFilled) {
      setShowValidationError(false);
    }
  }, [responses, showValidationError, isCompletelyFilled]);

  useEffect(() => {
    const dialog = dialogRef?.current;
    if (!dialog) return;

    const handleClose = () => {
      setShowValidationError(false);
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [dialogRef]);

  const dialogLabelId = "dialog-label";

  return (
    <dialog
      aria-modal="true"
      ref={dialogRef}
      tabIndex={-1}
      // Needed for storybook, as we're not able to pass in a ref and control the opening/closing of the dialog
      open={!dialogRef}
      aria-labelledby={dialogLabelId}
      className={classNames(
        "self-center m-auto justify-self-center backdrop:bg-black/40 max-sm:min-w-full max-sm:min-h-full",
        {
          "gap-40": !wasSubmitted,
          "self-auto! md:top-56 max-sm:min-h-auto! max-sm:top-auto!":
            wasSubmitted,
        },
      )}
    >
      <form
        method="dialog"
        aria-labelledby={dialogLabelId}
        // col-reverse needed to preserve correct tab order (top-right cancel button at the end of the tab order)
        className={classNames("flex gap-16 flex-col-reverse survey-modal", {
          "max-sm:min-h-auto! gap-0!": wasSubmitted,
        })}
      >
        <div className="flex flex-col gap-40">
          {wasSubmitted ? (
            <output>
              {translations.feedback["success-message"].de}{" "}
              {translations.feedback["feedback-helps"].de}
            </output>
          ) : (
            <div className="flex flex-col gap-40">
              {survey.questions.map((question, index) => {
                const Component = questionTypes[question.type];
                const isFirstQuestion = index === 0;
                return (
                  <div key={question.id}>
                    <Component
                      setResponses={setResponses}
                      question={question}
                      hasError={
                        showValidationError &&
                        !question.optional &&
                        !isCompleted({ questions: [question] }, responses)
                      }
                    />
                    {isFirstQuestion &&
                      showValidationError &&
                      !wasSubmitted && (
                        <div
                          className="flex items-center gap-8 text-red-800 mt-16"
                          role="alert"
                        >
                          <ErrorOutline className="w-20 h-20 shrink-0" />
                          <span>
                            {translations.feedback["validation-error"].de}
                          </span>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
          <ButtonContainer className="flex flex-col sm:flex-row">
            {wasSubmitted ? (
              <KernButton
                ref={closeButtonRef}
                size="large"
                look="secondary"
                text={translations.feedback.close.de}
                onClick={closeSurvey}
                type="button"
              />
            ) : (
              <div className="flex flex-col sm:flex-row gap-16 w-full">
                <KernButton
                  look="primary"
                  size="large"
                  className="w-full"
                  text={translations.feedback["submit-problem"].de}
                  type="button"
                  onClick={onSubmitClicked}
                />
                <KernButton
                  look="secondary"
                  size="large"
                  className="w-full"
                  text={translations.feedback.cancel.de}
                  onClick={closeSurvey}
                  type="button"
                />
              </div>
            )}
          </ButtonContainer>
        </div>
        <div className="flex justify-between items-center">
          <h2 id={dialogLabelId} className="ds-heading-02-reg">
            {wasSubmitted
              ? translations.feedback["problem-gemeldet"].de
              : translations.feedback["report-problem"].de}
          </h2>
        </div>
      </form>
    </dialog>
  );
};