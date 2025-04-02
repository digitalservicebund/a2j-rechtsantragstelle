import { type MultipleSurveyQuestion } from "posthog-js";
import { type Dispatch, type SetStateAction } from "react";
import { type SurveyResponses } from "~/components/userFeedback/ReportProblem/Survey";

type MultipleChoiceQuestionProps = {
  question: MultipleSurveyQuestion;
  setResponses: Dispatch<SetStateAction<SurveyResponses | undefined>>;
};

export const MultipleChoiceQuestion = ({
  question,
  setResponses,
}: MultipleChoiceQuestionProps) => {
  const onCheckboxClicked = (
    event: React.MouseEvent<HTMLInputElement>,
    choice: string,
  ) => {
    const checked = event.currentTarget.checked;
    setResponses((surveyResponses) => {
      const existingResponses =
        (surveyResponses?.[`$survey_response_${question.id!}`] as string[]) ??
        [];
      const newAnswers = checked
        ? [...existingResponses, choice]
        : existingResponses.filter((c) => c !== choice);

      return {
        ...surveyResponses,
        [`$survey_response_${question.id!}`]: newAnswers,
      };
    });
  };

  return question.choices.map((choice) => {
    const choiceName = choice.replaceAll(" ", "_");
    return (
      <div className="flex flex-col flex-nowrap" key={choiceName}>
        <div className="flex items-center">
          <input
            type="checkbox"
            name={choiceName}
            className="ds-checkbox forced-colors:outline forced-colors:border-[ButtonText]"
            onClick={(event) => onCheckboxClicked(event, choice)}
          />
          <label htmlFor={choiceName}>{choice}</label>
        </div>
      </div>
    );
  });
};
