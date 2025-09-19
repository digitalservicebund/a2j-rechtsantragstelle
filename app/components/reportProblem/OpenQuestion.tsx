import { type BasicSurveyQuestion } from "posthog-js";
import { useId, type Dispatch, type SetStateAction } from "react";
import { useFeedbackTranslations } from "~/components/content/userFeedback/feedbackTranslations";
import { TEXT_AREA_ROWS } from "~/components/formElements/Textarea";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { questionToAnswerId } from "../../services/analytics/surveys/questionToAnswerId";

export type SurveyResponses = Record<string, string | string[]>;

type OpenQuestionProps = {
  question: BasicSurveyQuestion;
  setResponses: Dispatch<SetStateAction<SurveyResponses | undefined>>;
};

export const OpenQuestion = ({ question, setResponses }: OpenQuestionProps) => {
  const feedbackTranslations = useFeedbackTranslations();
  const id = useId();
  const hasDescription = Boolean(question.description);
  const descriptionId = hasDescription ? id + "Description" : undefined;
  return (
    <div className="ds-stack ds-stack-8">
      <label className="ds-body-01-bold" htmlFor={id}>
        {question.question}
      </label>
      {hasDescription && (
        <p className="ds-body-01-reg text-gray-900" id={descriptionId}>
          {question.description}
        </p>
      )}
      <textarea
        id={id}
        name={question.id}
        aria-describedby={descriptionId}
        className="ds-textarea forced-colors:border-4"
        onChange={(event) =>
          setResponses((surveyResponses) => ({
            ...surveyResponses,
            [questionToAnswerId(question)]: event.target.value,
          }))
        }
        maxLength={TEXTAREA_CHAR_LIMIT}
        placeholder={feedbackTranslations["open-feedback-placeholder"]}
        rows={TEXT_AREA_ROWS}
      />
    </div>
  );
};
