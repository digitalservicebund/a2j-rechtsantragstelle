import classNames from "classnames";
import { type Survey, SurveyQuestionType } from "posthog-js";
import { type ElementType, useEffect, useState } from "react";
import Button from "~/components/common/Button";
import ButtonContainer from "~/components/common/ButtonContainer";
import { FeedbackSuccessMessage } from "~/components/content/userFeedback/FeedbackSuccessMessage";
import { useFeedbackTranslations } from "~/components/content/userFeedback/feedbackTranslations";
import { MultipleChoiceQuestion } from "~/components/reportProblem/MultipleChoiceQuestion";
import {
  OpenQuestion,
  type SurveyResponses,
} from "~/components/reportProblem/OpenQuestion";
import { isCompleted } from "~/services/analytics/surveys/isCompleted";
import { useAnalytics } from "~/services/analytics/useAnalytics";

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
  const feedbackTranslations = useFeedbackTranslations();
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
    <div
      className={classNames(
        "border-2 border-blue-800 max-sm:right-0 bg-white absolute bottom-0 p-24 flex flex-col",
        { "gap-40": !wasSubmitted },
      )}
    >
      {wasSubmitted ? (
        <FeedbackSuccessMessage
          subtitle={feedbackTranslations["feedback-helps"]}
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
            text={feedbackTranslations.close}
          />
        ) : (
          <>
            <Button
              look={"tertiary"}
              className="justify-center"
              onClick={closeSurvey}
              text={feedbackTranslations.cancel}
            />
            <Button
              look="primary"
              disabled={!isCompletelyFilled}
              className="justify-center"
              text={feedbackTranslations["submit-problem"]}
              onClick={onFeedbackSubmitted}
            />
          </>
        )}
      </ButtonContainer>
    </div>
  );
};
