import posthog, { type Survey } from "posthog-js";

const feedbackSurveyId = "01956b7e-2774-0000-49d7-d34d26811373";

export function fetchSurvey() {
  let survey: Survey | undefined;
  posthog.getSurveys((surveys) => {
    survey = surveys.find((survey) => survey.id === feedbackSurveyId);
  });
  return survey;
}
