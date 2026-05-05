import { useCallback, useMemo, useRef, useState } from "react";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { config } from "~/services/env/public";
import { translations } from "~/services/translations/translations";
import { isKeyOfObject } from "~/util/objects";
import { PosthogSurvey } from "./PosthogSurvey";
import { type SurveyResponses } from "./OpenQuestion";
import { Icon } from "../common/Icon";
import Button from "../formElements/Button";

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
        look="secondary"
        aria-haspopup="dialog"
        onClick={onReportProblemClicked}
        className="min-w-full justify-center sm:min-w-fit"
        text={translations.feedback["report-problem"].de}
        iconLeft={
          <Icon
            name="emergency-home"
            className="fill-kern-action-default! forced-color-adjust-auto"
          />
        }
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
