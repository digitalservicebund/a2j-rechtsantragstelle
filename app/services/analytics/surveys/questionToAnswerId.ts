import type { SurveyQuestion } from "posthog-js";

export const questionToAnswerId = (question: SurveyQuestion) =>
  `$survey_response_${question.id ?? ""}`;
