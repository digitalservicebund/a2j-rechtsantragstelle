import { type BasicSurveyQuestion } from "posthog-js";
import { useId, type Dispatch, type SetStateAction } from "react";
import { TEXT_AREA_ROWS } from "~/components/formElements/Textarea";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { questionToAnswerId } from "../../services/analytics/surveys/questionToAnswerId";

export type SurveyResponses = Record<string, string | string[]>;

type OpenQuestionProps = {
  question: BasicSurveyQuestion;
  setResponses: Dispatch<SetStateAction<SurveyResponses | undefined>>;
};

export const OpenQuestion = ({ question, setResponses }: OpenQuestionProps) => {
  const id = useId();
  const hasDescription = Boolean(question.description);
  const descriptionId = hasDescription ? id + "Description" : undefined;
  return (
    <div className="kern-stack-large">
      <label className="kern-label py-8" htmlFor={id}>
        {question.question}
      </label>
      {hasDescription && (
        <p
          className="kern-hint text-kern-18 font-normal py-8 mb-8"
          id={descriptionId}
        >
          {question.description}
        </p>
      )}
      <textarea
        id={id}
        name={question.id}
        aria-describedby={descriptionId}
        className="w-full px-16 py-8 gap-8 kern-form-input__input"
        onChange={(event) =>
          setResponses((surveyResponses) => ({
            ...surveyResponses,
            [questionToAnswerId(question)]: event.target.value,
          }))
        }
        maxLength={TEXTAREA_CHAR_LIMIT}
        rows={TEXT_AREA_ROWS}
      />
    </div>
  );
};
