import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { type Survey } from "posthog-js";
import { useState, useEffect } from "react";
import Button from "~/components/Button";
import { PostHogSurvey } from "~/components/reportProblem/Survey";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";

export const ReportProblem = () => {
  const feedbackTranslations = useFeedbackTranslations();
  const [survey, setSurvey] = useState<Pick<Survey, "id" | "questions"> | null>(
    null,
  );
  const [surveyOpen, setSurveyOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api-posthog-survey-list");

        if (response.ok) {
          const surveyData = await response.json();
          setSurvey({
            id: surveyData.id,
            questions: surveyData.questions,
          });
          setSurvey(surveyData);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Error fetching PostHog survey",
        );
      }
    };
    void fetchSurveys();
  }, []);

  const onButtonPressed = () => {
    if (survey) {
      setSurveyOpen(true);
    }
  };

  if (error || !survey) {
    return null;
  }

  return (
    <div className="p-24 justify-end flex relative">
      {surveyOpen && (
        <PostHogSurvey
          survey={survey}
          closeSurvey={() => setSurveyOpen(false)}
        />
      )}
      <Button
        look="tertiary"
        onClick={onButtonPressed}
        id="survey-button"
        className="h-40 px-24 py-10 min-w-full justify-center sm:min-w-fit"
        text={feedbackTranslations["report-problem"]}
        iconLeft={<FlagOutlined />}
      />
    </div>
  );
};
