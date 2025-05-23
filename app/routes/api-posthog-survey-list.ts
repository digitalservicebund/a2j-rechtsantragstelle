import { type Survey } from "posthog-js";

export async function loader() {
  const FEEDBACK_SURVEY_ID = process.env.FEEDBACK_SURVEY_ID;
  const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
  const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
  const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST;

  if (!POSTHOG_PROJECT_ID || !POSTHOG_PERSONAL_API_KEY || !FEEDBACK_SURVEY_ID) {
    return new Response("Error getting PostHog configuration", { status: 500 });
  }

  const response = await fetch(
    `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/surveys/${FEEDBACK_SURVEY_ID}`,
    {
      headers: {
        Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const surveys = await response.json();
  if (FEEDBACK_SURVEY_ID) {
    let filteredSurveys;
    if (surveys.results) {
      filteredSurveys = surveys.filter(
        (survey: Survey) => survey.id === FEEDBACK_SURVEY_ID,
      );
    } else if (surveys.id === FEEDBACK_SURVEY_ID) {
      filteredSurveys = [surveys];
    } else {
      filteredSurveys = [];
    }
    return {
      ...surveys,
      results: filteredSurveys,
    };
  }
}
