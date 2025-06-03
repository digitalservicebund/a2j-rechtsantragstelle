import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { useMemo, useState } from "react";
import Button from "~/components/Button";
import { PosthogSurvey } from "~/components/reportProblem/Survey";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { fetchSurvey } from "~/services/analytics/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";

const feedbackSurveyId = "01956b7e-2774-0000-49d7-d34d26811373";

export const ReportProblem = () => {
  const [surveyOpen, setSurveyOpen] = useState<boolean>();
  const feedbackTranslations = useFeedbackTranslations();
  const { posthogClient } = useAnalytics();
  const survey = useMemo(
    () => fetchSurvey(feedbackSurveyId, posthogClient),
    [posthogClient],
  );
  if (!survey) return null;

  return (
    <div className="p-24 justify-end flex relative">
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
        className="h-40 px-24 py-10 min-w-full justify-center sm:min-w-fit"
        text={feedbackTranslations["report-problem"]}
        iconLeft={<FlagOutlined />}
      ></Button>
    </div>
  );
};
