import classNames from "classnames";
import { type Survey, SurveyQuestionType } from "posthog-js";
import { type ElementType, useState } from "react";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import { FeedbackSuccessMessage } from "~/components/content/userFeedback/FeedbackSuccessMessage";
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

  return (
    <dialog
      aria-modal="false"
      ref={dialogRef}
      // Needed for storybook, as we're not able to pass in a ref and control the opening/closing of the dialog
      open={!dialogRef}
      aria-label={translations.feedback["report-problem"].de}
      className={classNames(
        "border-2 border-blue-800 bg-white absolute bottom-0 p-24 flex flex-col justify-center survey-modal-container",
        { "gap-40": !wasSubmitted },
      )}
    >
      <form
        method="dialog"
        aria-label={translations.feedback["report-problem"].de}
        className={classNames("flex flex-col gap-40 survey-modal", {
          "max-sm:min-h-auto! gap-0!": wasSubmitted,
        })}
      >
        {wasSubmitted ? (
          <FeedbackSuccessMessage
            subtitle={translations.feedback["feedback-helps"].de}
          />
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
        <ButtonContainer className="flex flex-col-reverse sm:flex-row">
          {wasSubmitted ? (
            <Button
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
                className="justify-center"
                text={translations.feedback.cancel.de}
                onClick={closeSurvey}
                type="reset"
              />
              <Button
                look="primary"
                disabled={!isCompletelyFilled}
                className="justify-center"
                text={translations.feedback["submit-problem"].de}
                type="button"
                onClick={onSubmitClicked}
              />
            </>
          )}
        </ButtonContainer>
      </form>
    </dialog>
  );
};
