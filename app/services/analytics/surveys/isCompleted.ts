import type { Survey } from "posthog-js";
import type { SurveyResponses } from "~/components/reportProblem/OpenQuestion";
import { questionToAnswerId } from "./questionToAnswerId";

export const isCompleted = (
  survey: Pick<Survey, "questions">,
  responses?: SurveyResponses,
) =>
  survey.questions
    .filter((question) => !question.optional)
    .map(questionToAnswerId)
    .every((id) => responses?.[id] && responses[id].length > 0);
