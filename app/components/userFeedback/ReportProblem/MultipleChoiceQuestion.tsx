import { type MultipleSurveyQuestion } from "posthog-js";
import { useState, type Dispatch, type SetStateAction } from "react";
import { type SurveyResponses } from "~/components/userFeedback/ReportProblem/Survey";

type MultipleChoiceQuestionProps = {
  question: MultipleSurveyQuestion;
  setResponses: Dispatch<SetStateAction<SurveyResponses | undefined>>;
};

export const MultipleChoiceQuestion = ({
  question,
  setResponses,
}: MultipleChoiceQuestionProps) => {
  const [checkboxStates, setCheckboxStates] = useState(
    question.choices.map(() => false),
  );

  const onCheckboxClicked = (idx: number, choice: string) => {
    const checked = !checkboxStates[idx];
    setCheckboxStates((prev) => prev.map((c, i) => (i === idx ? checked : c)));
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

  const onCheckboxKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Space") {
      event.currentTarget.click();
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-16">
      <p className="ds-body-01-bold">{question.question}</p>
      <div className="flex flex-col gap-16">
        {question.choices.map((choice, idx) => {
          const choiceName = choice.replaceAll(" ", "_");
          return (
            <div className="flex flex-col flex-nowrap" key={choiceName}>
              <div
                className="flex items-center"
                role="button"
                onKeyDown={onCheckboxKeydown}
                tabIndex={0}
                onClick={() => onCheckboxClicked(idx, choice)}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={checkboxStates[idx]}
                  name={choiceName}
                  className="ds-checkbox forced-colors:outline forced-colors:border-[ButtonText]"
                />
                <label htmlFor={choiceName}>{choice}</label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
