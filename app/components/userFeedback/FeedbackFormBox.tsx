import { ValidatedForm } from "@rvf/react-router";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { z } from "zod";
import Textarea from "~/components/inputs/Textarea";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { FeedbackSuccessMessage } from "./FeedbackSuccessMessage";
import { useFeedbackTranslations } from "./feedbackTranslations";
import { type FeedbackType } from "./FeedbackType";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import { useJsAvailable } from "../hooks/useJsAvailable";

const FEEDBACK_BUTTON_FIELD_NAME = "feedbackButton";
export const FEEDBACK_FIELD_NAME = "feedback";

export const feedbackSchema = z.object({
  feedback: z
    .string()
    .max(TEXTAREA_CHAR_LIMIT, { message: "max" })
    .refine(
      (feedback) => !/\s0\d/.test(feedback),
      "Bitte geben sie keine Telefonnummer ein.",
    )
    .refine(
      (feedback) => !feedback.includes("@"),
      "Bitte geben sie keine E-Mailadresse ein.",
    ),
});

type FeedbackBoxProps = {
  readonly destination: string;
  readonly shouldFocus: boolean;
  readonly onSubmit: () => void;
  readonly feedback?: FeedbackType;
};

const getFeedbackFromUrl = (url: string) => {
  return new URLSearchParams(url).get("wasHelpful");
};

const HEADING_PERSONAL_DATA_FEEDBACK_ID = "heading-personal-data-feedback-id";

export const FeedbackFormBox = ({
  destination,
  shouldFocus,
  onSubmit,
  feedback,
}: FeedbackBoxProps) => {
  const jsAvailable = useJsAvailable();
  const location = useLocation();

  const textAreaReference = useRef<HTMLTextAreaElement | null>(null);

  const feedbackTranslations = useFeedbackTranslations();

  useEffect(() => {
    if (shouldFocus && textAreaReference.current) {
      textAreaReference.current.focus();
    }
  }, [shouldFocus]);

  if (!feedback) {
    const wasHelpful = getFeedbackFromUrl(location.search);
    if (wasHelpful === "yes") feedback = "positive";
    else if (wasHelpful === "no") feedback = "negative";
    else return null;
  }

  const feedbackText = {
    ["positive"]: feedbackTranslations["positive-feedback-question"],
    ["negative"]: feedbackTranslations["negative-feedback-question"],
  }[feedback];

  return (
    <ValidatedForm
      schema={feedbackSchema}
      defaultValues={{ feedback: "" }}
      method="post"
      action={`/action/send-feedback?url=${destination}&js=${String(jsAvailable)}`}
      preventScrollReset={true}
      onSubmit={onSubmit}
    >
      <FeedbackSuccessMessage
        subtitle={feedbackTranslations["antwort-uebermittelt"]}
      />
      <div className="ds-stack ds-stack-16">
        <div>
          <label htmlFor={FEEDBACK_FIELD_NAME} className="ds-label-01-bold">
            {feedbackText}
          </label>
          <p
            id={HEADING_PERSONAL_DATA_FEEDBACK_ID}
            className="ds-text-02-reg text-gray-800"
          >
            {feedbackTranslations["heading-personal-data-feedback"]}
          </p>
        </div>
        <Textarea
          name={FEEDBACK_FIELD_NAME}
          classNameLabel="ds-label-01-bold"
          placeholder={feedbackTranslations["placeholder-feedback"]}
          innerRef={textAreaReference}
          ariaDescribedby={HEADING_PERSONAL_DATA_FEEDBACK_ID}
        />
        <ButtonContainer>
          <Button
            look="primary"
            name={FEEDBACK_BUTTON_FIELD_NAME}
            value={"submit"}
            type="submit"
          >
            {feedbackTranslations["submit-button-feedback"]}
          </Button>
        </ButtonContainer>
      </div>
    </ValidatedForm>
  );
};
