import { SurveyQuestionType, type Survey } from "posthog-js";
import { type ElementType, useState } from "react";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import { FeedbackTitle } from "~/components/userFeedback/FeedbackTitle";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { MultipleChoiceQuestion } from "~/components/userFeedback/ReportProblem/MultipleChoiceQuestion";
import { OpenQuestion } from "~/components/userFeedback/ReportProblem/OpenQuestion";

type PosthogSurveyProps = {
  survey: Survey;
  closeSurvey: () => void;
};

export type SurveyResponses = Record<string, string | string[]>;

const questionTypes: Record<string, ElementType> = {
  [SurveyQuestionType.Open]: OpenQuestion,
  [SurveyQuestionType.MultipleChoice]: MultipleChoiceQuestion,
  [SurveyQuestionType.SingleChoice]: () => <></>,
  [SurveyQuestionType.Rating]: () => <></>,
  [SurveyQuestionType.Link]: () => <></>,
};

export const PosthogSurvey = ({ survey, closeSurvey }: PosthogSurveyProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const feedbackTranslations = useFeedbackTranslations();
  const [, setResponses] = useState<SurveyResponses>();

  return (
    <div className="border-2 border-blue-800 bg-white absolute bottom-[80%] p-24 flex flex-col gap-40">
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
      <ButtonContainer>
        {isComplete ? (
          <Button
            look={"primary"}
            onClick={closeSurvey}
            text={feedbackTranslations.close}
          />
        ) : (
          <>
            <Button
              look={"tertiary"}
              onClick={closeSurvey}
              text={feedbackTranslations.cancel}
            />
            <Button
              look="primary"
              text={feedbackTranslations["submit-problem"]}
              onClick={() => {
                setIsComplete(true);
              }}
            />
          </>
        )}
      </ButtonContainer>
    </div>
  );
};
