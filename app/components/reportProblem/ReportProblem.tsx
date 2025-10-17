import FlagOutlined from "@digitalservicebund/icons/FlagOutlined";
import { useCallback, useMemo, useRef, useState } from "react";
import Button from "~/components/common/Button";
import { type SurveyResponses } from "~/components/reportProblem/OpenQuestion";
import { PosthogSurvey } from "~/components/reportProblem/Survey";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { config } from "~/services/env/public";
import { translations } from "~/services/translations/translations";
import { isKeyOfObject } from "~/util/objects";

const surveyIds = {
  production: "01956b7e-2774-0000-49d7-d34d26811373",
  staging: "019745bc-656c-0000-b124-c8851e8b6bde",
} as const;

export const ReportProblem = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const { posthogClient } = useAnalytics();
  const { ENVIRONMENT } = config();

  const surveyId = isKeyOfObject(ENVIRONMENT, surveyIds)
    ? surveyIds[ENVIRONMENT]
    : surveyIds.staging;

  const survey = useMemo(
    () => fetchSurvey(surveyId, posthogClient),
    [posthogClient, surveyId],
  );

  const closeSurvey = useCallback(() => {
    if (wasSubmitted) {
      setWasSubmitted(false);
    }
    dialogRef?.current?.close();
  }, [wasSubmitted]);

  const submitFeedback = (responses: SurveyResponses) => {
    if (posthogClient) {
      posthogClient.capture("survey sent", {
        $survey_id: survey?.id,
        ...responses,
      });
      setWasSubmitted(true);
    }
  };

  const onReportProblemClicked = () => {
    // Needed to disable top-level scrolling when the Survey popup is open
    dialogRef.current?.showModal();
  };

  if (!survey) return null;

  return (
    <>
      <Button
        look="tertiary"
        aria-haspopup="dialog"
        onClick={onReportProblemClicked}
        className="min-w-full justify-center sm:min-w-fit mt-80"
        text={translations.feedback["report-problem"].de}
        iconLeft={<FlagOutlined />}
      />
      <PosthogSurvey
        dialogRef={dialogRef}
        survey={survey}
        wasSubmitted={wasSubmitted}
        submitFeedback={submitFeedback}
        closeSurvey={closeSurvey}
      />
    </>
  );
};
