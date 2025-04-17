import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { useState } from "react";
import Button from "~/components/Button";
import { PosthogSurvey } from "~/components/reportProblem/Survey";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { usePosthog } from "~/services/analytics/PosthogContext";

export const ReportProblem = () => {
  const feedbackTranslations = useFeedbackTranslations();
  const { fetchSurvey } = usePosthog();
  const survey = fetchSurvey();
  const [surveyOpen, setSurveyOpen] = useState<boolean>();

  const onButtonPressed = () => {
    if (survey) {
      setSurveyOpen(true);
    }
  };

  return (
    <div className="p-24 justify-end flex relative">
      {surveyOpen && survey && (
        <PosthogSurvey
          survey={survey}
          closeSurvey={() => setSurveyOpen(false)}
        />
      )}
      <Button
        look="tertiary"
        disabled={!survey}
        onClick={onButtonPressed}
        id="survey-button"
        className="h-40 px-24 py-10 min-w-full justify-center sm:min-w-fit"
        text={feedbackTranslations["report-problem"]}
        iconLeft={<FlagOutlined />}
      ></Button>
    </div>
  );
};
