import { type BasicSurveyQuestion } from "posthog-js";
import { type Dispatch, type SetStateAction } from "react";
import { TEXT_AREA_ROWS } from "~/components/inputs/Textarea";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { questionToAnswerId } from "../../services/analytics/surveys/questionToAnswerId";

export type SurveyResponses = Record<string, string | string[]>;

type OpenQuestionProps = {
  question: BasicSurveyQuestion;
  setResponses: Dispatch<SetStateAction<SurveyResponses | undefined>>;
};

export const OpenQuestion = ({ question, setResponses }: OpenQuestionProps) => {
  const feedbackTranslations = useFeedbackTranslations();
  return (
    <div className="ds-stack ds-stack-8">
      <p className="ds-body-01-bold">{question.question}</p>
      <label className="flex flex-col gap-8">
        <p className="ds-body-01-reg text-gray-900">{question.description}</p>
        <textarea
          name={question.id}
          className="ds-textarea forced-color-adjust-none"
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
      </label>
    </div>
  );
};
