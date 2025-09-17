import Close from "@digitalservicebund/icons/Close";
import classNames from "classnames";
import { type Survey, SurveyQuestionType } from "posthog-js";
import { type ElementType, useState } from "react";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import { MultipleChoiceQuestion } from "~/components/reportProblem/MultipleChoiceQuestion";
import {
  OpenQuestion,
  type SurveyResponses,
} from "~/components/reportProblem/OpenQuestion";
import { isCompleted } from "~/services/analytics/surveys/isCompleted";
import { translations } from "~/services/translations/translations";

type PosthogSurveyProps = {
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

export const PosthogSurvey = ({
  survey,
  wasSubmitted,
  submitFeedback,
  closeSurvey,
  dialogRef,
}: PosthogSurveyProps) => {
  const [responses, setResponses] = useState<SurveyResponses>();
  const isCompletelyFilled = isCompleted(survey, responses);

  const onSubmitClicked = () => {
    if (responses && isCompletelyFilled) {
      submitFeedback(responses);
      setResponses(undefined);
    }
  };

  const dialogLabelId = "dialog-label";

  return (
    <dialog
      aria-modal="true"
      ref={dialogRef}
      // Needed for storybook, as we're not able to pass in a ref and control the opening/closing of the dialog
      open={!dialogRef}
      aria-labelledby={dialogLabelId}
      className={classNames(
        "self-center justify-self-center backdrop:bg-black/40",
        {
          "gap-40": !wasSubmitted,
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
              {survey.questions.map((question) => {
                const Component = questionTypes[question.type];
                return (
                  <Component
                    key={question.id}
                    setResponses={setResponses}
                    question={question}
                  />
                );
              })}
            </div>
          )}
          <ButtonContainer className="flex flex-col sm:flex-row">
            {wasSubmitted ? (
              <Button
                size="large"
                look={"primary"}
                className="justify-center"
                text={translations.feedback.close.de}
                onClick={closeSurvey}
                type="reset"
              />
            ) : (
              <>
                <Button
                  look={"tertiary"}
                  size="large"
                  className="justify-center"
                  text={translations.feedback.cancel.de}
                  onClick={closeSurvey}
                  type="button"
                />
                <Button
                  look="primary"
                  size="large"
                  disabled={!isCompletelyFilled}
                  aria-disabled={!isCompletelyFilled}
                  className="justify-center"
                  text={translations.feedback["submit-problem"].de}
                  type="button"
                  onClick={onSubmitClicked}
                />
              </>
            )}
          </ButtonContainer>
        </div>
        <div className="flex justify-between items-center">
          <h2 id={dialogLabelId} className="ds-heading-02-reg">
            {wasSubmitted
              ? translations.feedback["problem-gemeldet"].de
              : translations.feedback["report-problem"].de}
          </h2>
          <Button
            type="button"
            size="large"
            look="ghost"
            iconLeft={<Close />}
            aria-label={translations.feedback.cancel.de}
            onClick={closeSurvey}
          />
        </div>
      </form>
    </dialog>
  );
};
