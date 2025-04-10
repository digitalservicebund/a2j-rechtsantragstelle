import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { type Survey } from "posthog-js";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { PosthogSurvey } from "~/components/userFeedback/reportProblem/Survey";
import { usePosthog } from "~/services/analytics/PosthogContext";

export const ReportProblem = () => {
  const feedbackTranslations = useFeedbackTranslations();
  const { fetchSurvey } = usePosthog();
  const [survey, setSurvey] = useState<Pick<Survey, "id" | "questions">>();
  const [surveyOpen, setSurveyOpen] = useState<boolean>();

  useEffect(() => {
    setSurvey(fetchSurvey());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
