import { useCallback, useMemo, useRef, useState } from "react";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { config } from "~/services/env/public";
import { translations } from "~/services/translations/translations";
import { isKeyOfObject } from "~/util/objects";
import { KernPosthogSurvey } from "./KernPosthogSurvey";
import KernButton from "./KernButton";
import { type SurveyResponses } from "./KernOpenQuestion";
import { Icon } from "../common/Icon";

const surveyIds = {
  production: "01956b7e-2774-0000-49d7-d34d26811373",
  staging: "019745bc-656c-0000-b124-c8851e8b6bde",
} as const;

export const KernReportProblem = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const { posthogClient } = useAnalytics();
  const { ENVIRONMENT } = config();

  const surveyId = isKeyOfObject(ENVIRONMENT, surveyIds)
    ? surveyIds[ENVIRONMENT]
    : surveyIds.staging;

  // const survey = useMemo(
  //   () => fetchSurvey(surveyId, posthogClient),
  //   [posthogClient, surveyId],
  // );

  const survey = {
    "appearance": {
        "backgroundColor": "#eeeded",
        "borderColor": "#c9c6c6",
        "borderRadius": "10px",
        "boxPadding": "20px 24px",
        "boxShadow": "0 4px 12px rgba(0, 0, 0, 0.15)",
        "disabledButtonOpacity": "0.6",
        "displayThankYouMessage": true,
        "fontFamily": "inherit",
        "inputBackground": "white",
        "maxWidth": "300px",
        "placeholder": "Start typing...",
        "position": "right",
        "ratingButtonActiveColor": "black",
        "ratingButtonColor": "white",
        "shuffleQuestions": false,
        "submitButtonColor": "black",
        "submitButtonTextColor": "white",
        "textSubtleColor": "#939393",
        "thankYouMessageDescription": "",
        "thankYouMessageHeader": "Thank you for your feedback!",
        "whiteLabel": false,
        "zIndex": "2147482647"
    },
    "conditions": null,
    "current_iteration": null,
    "current_iteration_start_date": null,
    "enable_partial_responses": false,
    "end_date": null,
    "id": "019745bc-656c-0000-b124-c8851e8b6bde",
    "internal_targeting_flag_key": "survey-targeting-97c2e5c0a0-custom",
    "name": "Report a problem on flow pages",
    "questions": [
        {
            "buttonText": "Weiter",
            "choices": [
                "Frage ist unklar oder mehrdeutig",
                "Frage passt nicht zu meiner Situation",
                "Technisches Problem",
                "Sonstiges"
            ],
            "description": "",
            "descriptionContentType": "text",
            "hasOpenChoice": true,
            "id": "275706d5-9b43-4262-ba3c-d3aff906d789",
            "question": "Welche Probleme gibt es mit dieser Formular-Seite?",
            "shuffleOptions": true,
            "type": "multiple_choice"
        },
        {
            "buttonText": "Weiter",
            "description": "Bitte tragen Sie keine persönlichen Daten ein. Ihr Feedback wird anonym erfasst.\n\n",
            "descriptionContentType": "text",
            "id": "f876d62a-66c9-40b5-9ff2-1624fca81d90",
            "optional": true,
            "question": "Helfen Sie uns, das Problem noch besser zu verstehen (optional).",
            "type": "open"
        }
    ],
    "schedule": "once",
    "start_date": "2025-06-06T14:54:27.621000Z",
    "type": "api"
};

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
      <KernButton
        look="secondary"
        aria-haspopup="dialog"
        onClick={onReportProblemClicked}
        className="min-w-full justify-center sm:min-w-fit mt-80"
        text={translations.feedback["report-problem"].de}
        iconLeft={
          <Icon name="emergency_home" className="fill-kern-action-default!"/>
        }
      />
      <KernPosthogSurvey
        dialogRef={dialogRef}
        survey={survey}
        wasSubmitted={wasSubmitted}
        submitFeedback={submitFeedback}
        closeSurvey={closeSurvey}
      />
    </>
  );
};
