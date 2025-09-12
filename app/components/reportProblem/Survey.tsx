import classNames from "classnames";
import { type Survey, SurveyQuestionType } from "posthog-js";
import { type ElementType, useEffect, useState } from "react";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import { FeedbackSuccessMessage } from "~/components/content/userFeedback/FeedbackSuccessMessage";
import { MultipleChoiceQuestion } from "~/components/reportProblem/MultipleChoiceQuestion";
import {
  OpenQuestion,
  type SurveyResponses,
} from "~/components/reportProblem/OpenQuestion";
import { isCompleted } from "~/services/analytics/surveys/isCompleted";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { translations } from "~/services/translations/translations";

type PosthogSurveyProps = {
  survey: Pick<Survey, "id" | "questions">;
  closeSurvey: () => void;
};

const questionTypes: Record<string, ElementType> = {
  [SurveyQuestionType.Open]: OpenQuestion,
  [SurveyQuestionType.MultipleChoice]: MultipleChoiceQuestion,
  [SurveyQuestionType.SingleChoice]: () => <></>,
  [SurveyQuestionType.Rating]: () => <></>,
  [SurveyQuestionType.Link]: () => <></>,
};

export const PosthogSurvey = ({ survey, closeSurvey }: PosthogSurveyProps) => {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [responses, setResponses] = useState<SurveyResponses>();
  const { posthogClient } = useAnalytics();
  const isCompletelyFilled = isCompleted(survey, responses);

  useEffect(() => {
    const closeDialogOnEscape = (event: KeyboardEvent) =>
      event.key === "Escape" ? closeSurvey() : null;

    window.addEventListener("keyup", closeDialogOnEscape);
    return () => window.removeEventListener("keyup", closeDialogOnEscape);
  }, [closeSurvey]);

  const onFeedbackSubmitted = () => {
    if (isCompletelyFilled && posthogClient) {
      posthogClient.capture("survey sent", {
        $survey_id: survey.id,
        ...responses,
      });
      setWasSubmitted(true);
    }
  };

  return (
    <dialog
      aria-label={translations.feedback["report-problem"].de}
      className={classNames(
        "border-2 border-blue-800 bg-white absolute bottom-0 p-24 flex flex-col justify-center survey-modal-container",
        { "gap-40": !wasSubmitted },
      )}
    >
      <div
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
              onClick={closeSurvey}
              text={translations.feedback.close.de}
            />
          ) : (
            <>
              <Button
                look={"tertiary"}
                className="justify-center"
                onClick={closeSurvey}
                text={translations.feedback.cancel.de}
              />
              <Button
                look="primary"
                disabled={!isCompletelyFilled}
                className="justify-center"
                text={translations.feedback["submit-problem"].de}
                onClick={onFeedbackSubmitted}
              />
            </>
          )}
        </ButtonContainer>
      </div>
    </dialog>
  );
};
