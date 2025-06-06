import type { PostHog, Survey } from "posthog-js";

export const fetchSurvey = (surveyId: string, posthogClient?: PostHog) => {
  let survey: Survey | undefined;
  posthogClient?.getSurveys((surveys) => {
    survey = surveys.find((survey) => survey.id === surveyId);
  });
  return survey;
};
