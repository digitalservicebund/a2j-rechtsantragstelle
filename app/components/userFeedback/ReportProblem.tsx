import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { posthog, type Survey } from "posthog-js";
import { useEffect, useState } from "react";
import Button from "~/components/Button";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { PosthogSurvey } from "~/components/userFeedback/Survey";
import { config } from "~/services/env/web";

const feedbackSurveyId = "01956b7e-2774-0000-49d7-d34d26811373";

export const ReportProblem = () => {
  const feedbackTranslations = useFeedbackTranslations();
  const { POSTHOG_API_KEY, POSTHOG_API_HOST } = config();
  const [survey, setSurvey] = useState<Survey>();
  const [surveyOpen, setSurveyOpen] = useState<boolean>();

  const fetchSurvey = () => {
    posthog.getSurveys((surveys) =>
      setSurvey(surveys.find((survey) => survey.id === feedbackSurveyId)),
    );
  };

  useEffect(() => {
    if (!posthog.__loaded) {
      if (POSTHOG_API_KEY) {
        posthog.init(POSTHOG_API_KEY, {
          api_host: POSTHOG_API_HOST,
          loaded: () => {
            fetchSurvey();
          },
        });
      }
    }
    fetchSurvey();
  }, [POSTHOG_API_HOST, POSTHOG_API_KEY]);

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
