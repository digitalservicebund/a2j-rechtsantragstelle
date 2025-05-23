import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { type Survey } from "posthog-js";
import { useState } from "react";
import Button from "~/components/Button";
import { PosthogSurvey } from "~/components/reportProblem/Survey";
import { useFeedbackTranslations } from "~/components/userFeedback/feedbackTranslations";
import { useSurvey } from "./useSurvey";

export const ReportProblem = () => {
  const { fetchSurvey } = useSurvey();
  const feedbackTranslations = useFeedbackTranslations();
  const [surveyOpen, setSurveyOpen] = useState<boolean>(false);
  const [surveyData, setSurveyData] = useState<Pick<
    Survey,
    "id" | "questions"
  > | null>(null);

  const onButtonPressed = async () => {
    const survey = await fetchSurvey();
    if (!survey) return null;
    if (survey) {
      setSurveyData({ id: survey.id, questions: survey.questions });
      setSurveyOpen(true);
    }
  };

  return (
    <div className="p-24 justify-end flex relative">
      {surveyOpen && surveyData && (
        <PosthogSurvey
          survey={surveyData}
          closeSurvey={() => setSurveyOpen(false)}
        />
      )}
      <Button
        look="tertiary"
        onClick={() => {
          void onButtonPressed();
        }}
        id="survey-button"
        className="h-40 px-24 py-10 min-w-full justify-center sm:min-w-fit"
        text={feedbackTranslations["report-problem"]}
        iconLeft={<FlagOutlined />}
      />
    </div>
  );
};
