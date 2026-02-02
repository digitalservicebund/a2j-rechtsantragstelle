import { type Survey, SurveyQuestionType } from "posthog-js";
import { type ElementType, useEffect, useRef, useState } from "react";
import { isCompleted } from "~/services/analytics/surveys/isCompleted";
import { translations } from "~/services/translations/translations";
import KernButton from "./KernButton";
import { KernOpenQuestion, type SurveyResponses } from "./KernOpenQuestion";
import { KernMultipleChoiceQuestion } from "./KernMultipleChoiceQuestion";
import { KernIcon } from "./common/KernIcon";

type KernPosthogSurveyProps = {
  survey: Pick<Survey, "id" | "questions">;
  wasSubmitted: boolean;
  submitFeedback: (responses: SurveyResponses) => void;
  closeSurvey: () => void;
  // Marked as optional for ease of storybook mocking
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
};

const questionTypes: Record<string, ElementType> = {
  [SurveyQuestionType.Open]: KernOpenQuestion,
  [SurveyQuestionType.MultipleChoice]: KernMultipleChoiceQuestion,
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
      className="kern-dialog m-auto max-w-l grounded-2xl bg-white p-0"
    >
      <header className="kern-dialog__header">
        <h2 id={dialogLabelId} className="kern-title kern-title--large">
          {wasSubmitted
            ? translations.feedback["problem-gemeldet"].de
            : translations.feedback["report-problem"].de}
        </h2>
        <KernButton
          type="button"
          look="ghost"
          iconLeft={
            <KernIcon name="close" className="fill-kern-action-default!" />
          }
          aria-label={
            wasSubmitted
              ? translations.feedback.close.de
              : translations.feedback.cancel.de
          }
          onClick={closeSurvey}
        />
      </header>
      <section className="kern-dialog__body">
        {wasSubmitted ? (
          <output className="kern-body">
            {translations.feedback["success-message"].de}{" "}
            {translations.feedback["feedback-helps"].de}
          </output>
        ) : (
          <div className="flex flex-col gap-40">
            {survey.questions.map((question) => {
              const Component = questionTypes[question.type];
              return (
                <div key={question.id}>
                  <Component
                    question={question}
                    setResponses={setResponses}
                    hasError={
                      showValidationError &&
                      !question.optional &&
                      !isCompleted({ questions: [question] }, responses)
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
      <footer className="kern-dialog__footer">
        {wasSubmitted ? (
          <KernButton
            ref={closeButtonRef}
            className="kern-btn kern-btn--secondary kern-btn--large"
            onClick={closeSurvey}
            type="button"
          >
            <span className="kern-label">{translations.feedback.close.de}</span>
          </KernButton>
        ) : (
          <>
            <KernButton
              className="kern-btn kern-btn--secondary kern-btn--large"
              type="button"
              onClick={closeSurvey}
            >
              <span className="kern-label">
                {translations.feedback.cancel.de}
              </span>
            </KernButton>

            <KernButton
              className="kern-btn kern-btn--primary kern-btn--large"
              type="button"
              onClick={onSubmitClicked}
            >
              <span className="kern-label">
                {translations.feedback["submit-problem"].de}
              </span>
            </KernButton>
          </>
        )}
      </footer>
    </dialog>
  );
};
