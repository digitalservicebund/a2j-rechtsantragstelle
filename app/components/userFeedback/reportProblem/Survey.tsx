import classNames from "classnames";
import { posthog, SurveyQuestionType, type Survey } from "posthog-js";
import { type ElementType, useState } from "react";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import { FeedbackTitle } from "~/components/userFeedback/FeedbackTitle";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { MultipleChoiceQuestion } from "~/components/userFeedback/reportProblem/MultipleChoiceQuestion";
import { OpenQuestion } from "~/components/userFeedback/reportProblem/OpenQuestion";

type PosthogSurveyProps = {
  survey: Survey;
  closeSurvey: () => void;
  styleOverrides?: string;
};

export type SurveyResponses = Record<string, string | string[]>;

const questionTypes: Record<string, ElementType> = {
  [SurveyQuestionType.Open]: OpenQuestion,
  [SurveyQuestionType.MultipleChoice]: MultipleChoiceQuestion,
  [SurveyQuestionType.SingleChoice]: () => <></>,
  [SurveyQuestionType.Rating]: () => <></>,
  [SurveyQuestionType.Link]: () => <></>,
};

export const PosthogSurvey = ({
  survey,
  closeSurvey,
  styleOverrides,
}: PosthogSurveyProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const feedbackTranslations = useFeedbackTranslations();
  const [responses, setResponses] = useState<SurveyResponses>();

  const containerClasses = classNames(
    "border-2 border-blue-800 max-sm:right-0 bg-white absolute bottom-[80%] p-24 flex flex-col",
    {
      "gap-40": !isComplete,
    },
    styleOverrides,
  );

  const onFeedbackSubmitted = () => {
    if (responses) {
      posthog.capture("survey sent", {
        $survey_id: survey.id,
        ...responses,
      });
      setIsComplete(true);
    }
  };

  return (
    <div className={containerClasses}>
      {isComplete ? (
        <FeedbackTitle
          title={feedbackTranslations["success-message"]}
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
        {isComplete ? (
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
              disabled={!responses}
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
