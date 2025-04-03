import { type BasicSurveyQuestion } from "posthog-js";
import { type Dispatch, type SetStateAction } from "react";
import { TEXT_AREA_ROWS } from "~/components/inputs/Textarea";
import { type SurveyResponses } from "~/components/userFeedback/ReportProblem/Survey";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";

type OpenQuestionProps = {
  question: BasicSurveyQuestion;
  setResponses: Dispatch<SetStateAction<SurveyResponses | undefined>>;
};

export const OpenQuestion = ({ question, setResponses }: OpenQuestionProps) => {
  return (
    <div className="ds-stack ds-stack-8">
      <p className="ds-body-01-bold">{question.question}</p>
      <p className="ds-body-01-reg text-gray-900">{question.description}</p>
      <textarea
        name={question.id}
        className="ds-textarea forced-color-adjust-none"
        onChange={(event) =>
          setResponses((surveyResponses) => ({
            ...surveyResponses,
            [`$survey_response_${question.id}`]: event.target.value,
          }))
        }
        maxLength={TEXTAREA_CHAR_LIMIT}
        placeholder="Beschreibung des Problems ..."
        rows={TEXT_AREA_ROWS}
      />
    </div>
  );
};
