import { type MultipleSurveyQuestion } from "posthog-js";
import { useState, type Dispatch, type SetStateAction } from "react";
import classNames from "classnames";
import { questionToAnswerId } from "../../services/analytics/surveys/questionToAnswerId";
import { SurveyResponses } from "./KernOpenQuestion";

type KernMultipleChoiceQuestionProps = {
  question: MultipleSurveyQuestion;
  setResponses: Dispatch<SetStateAction<SurveyResponses | undefined>>;
  hasError?: boolean;
};

export const KernMultipleChoiceQuestion = ({
  question,
  setResponses,
  hasError = false,
}: KernMultipleChoiceQuestionProps) => {
  const [checkboxStates, setCheckboxStates] = useState(
    question.choices.map(() => false),
  );

  const onCheckboxClicked = (idx: number, choice: string) => {
    const checked = !checkboxStates[idx];
    setCheckboxStates((prev) => prev.map((c, i) => (i === idx ? checked : c)));
    setResponses((surveyResponses) => {
      const existingResponses =
        (surveyResponses?.[questionToAnswerId(question)] as string[]) ?? [];
      const newAnswers = checked
        ? [...existingResponses, choice]
        : existingResponses.filter((c) => c !== choice);

      return {
        ...surveyResponses,
        [questionToAnswerId(question)]: newAnswers,
      };
    });
  };

  return (
    <fieldset>
      <legend className="kern-text font-semibold py-8">
        {question.question}
      </legend>
      <div className="flex flex-col gap-16">
        {question.choices.map((choice, idx) => {
          const choiceName = choice.replaceAll(" ", "_");
          return (
            <label
              className="flex items-center gap-16 flex-nowrap"
              key={choiceName}
            >
              <input
                type="checkbox"
                checked={checkboxStates[idx]}
                name={choiceName}
                readOnly
                onClick={() => onCheckboxClicked(idx, choice)}
                className={classNames("kern-form-check__checkbox", {
                  "kern-form-check__checkbox--error": hasError,
                })}
              />
              {choice}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
