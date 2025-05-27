import { ValidatedForm } from "@rvf/react-router";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { z } from "zod";
import Textarea from "~/components/inputs/Textarea";
import { FeedbackTitle } from "~/components/userFeedback/FeedbackTitle";
import { useJsAvailable } from "~/services/useJsAvailable";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { useFeedbackTranslations } from "./feedbackTranslations";
import { type FeedbackType } from "./FeedbackType";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";

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
      <FeedbackTitle
        title={feedbackTranslations["success-message"]}
        subtitle={feedbackTranslations["antwort-uebermittelt"]}
      />
      <div role="status" className="ds-stack ds-stack-16">
        <div>
          <label htmlFor={FEEDBACK_FIELD_NAME} className="ds-label-01-bold">
            {feedbackText}
          </label>
          <p className="ds-text-02-reg text-gray-800">
            {feedbackTranslations["heading-personal-data-feedback"]}
          </p>
        </div>
        <Textarea
          name={FEEDBACK_FIELD_NAME}
          classNameLabel="ds-label-01-bold"
          placeholder={feedbackTranslations["placeholder-feedback"]}
          role="status"
          innerRef={textAreaReference}
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
