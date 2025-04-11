import { type MultipleSurveyQuestion } from "posthog-js";
import { useState, type Dispatch, type SetStateAction } from "react";
import { type SurveyResponses } from "./OpenQuestion";

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

  return (
    <div className="flex flex-col gap-16">
      <p className="ds-body-01-bold">{question.question}</p>
      <div className="flex flex-col gap-16">
        {question.choices.map((choice, idx) => {
          const choiceName = choice.replaceAll(" ", "_");
          return (
            <div className="flex flex-col flex-nowrap" key={choiceName}>
              <div className="flex items-center">
                <label className="w-full flex items-center gap-16">
                  <input
                    type="checkbox"
                    checked={checkboxStates[idx]}
                    name={choiceName}
                    readOnly
                    onClick={() => onCheckboxClicked(idx, choice)}
                    className="ds-checkbox forced-colors:outline forced-colors:border-[ButtonText]"
                  />
                  {choice}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
