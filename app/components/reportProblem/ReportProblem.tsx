import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { useMemo, useState } from "react";
import Button from "~/components/common/Button";
import { useFeedbackTranslations } from "~/components/content/userFeedback/feedbackTranslations";
import { PosthogSurvey } from "~/components/reportProblem/Survey";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { config } from "~/services/env/public";
import { isKeyOfObject } from "~/util/objects";

const surveyIds = {
  production: "01956b7e-2774-0000-49d7-d34d26811373",
  staging: "019745bc-656c-0000-b124-c8851e8b6bde",
} as const;

export const ReportProblem = () => {
  const [surveyOpen, setSurveyOpen] = useState<boolean>();
  const feedbackTranslations = useFeedbackTranslations();
  const { posthogClient } = useAnalytics();
  const { ENVIRONMENT } = config();

  const surveyId = isKeyOfObject(ENVIRONMENT, surveyIds)
    ? surveyIds[ENVIRONMENT]
    : surveyIds.staging;

  const survey = useMemo(
    () => fetchSurvey(surveyId, posthogClient),
    [posthogClient, surveyId],
  );
  if (!survey) return null;

  return (
    <>
      {surveyOpen && (
        <PosthogSurvey
          survey={survey}
          closeSurvey={() => setSurveyOpen(false)}
        />
      )}
      <Button
        look="tertiary"
        onClick={() => setSurveyOpen(true)}
        id="survey-button"
        className="min-w-full justify-center sm:min-w-fit mt-80"
        text={feedbackTranslations["report-problem"]}
        iconLeft={<FlagOutlined />}
      />
    </>
  );
};
