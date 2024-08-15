import CloseIcon from "@digitalservicebund/icons/CloseOutlined";
import SendIcon from "@digitalservicebund/icons/SendOutlined";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useRef, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { useFeedbackTranslations } from "./FeedbackTranslationContext";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import Textarea from "../inputs/Textarea";

export const feedbackFormName = "feedbackForm";
const feedbackFieldname = "feedback";
const feedbackButtonFieldname = "feedbackButton";

export const HEADING_FEEDBACK_TRANSLATION_KEY = "heading-feedback";
export const PLACEHOLDER_FEEDBACK_TRANSLATION_KEY = "placeholder-feedback";
export const ABORT_BUTTON_FEEDBACK_TRANSLATION_KEY = "abort-button-feedback";
export const SUBMIT_BUTTON_FEEDBACK_TRANSLATION_KEY = "submit-button-feedback";

enum FeedbackButtons {
  Abort = "abort",
  Submit = "submit",
}

export const feedbackValidator = withZod(
  z.object({
    feedback: z
      .string()
      .refine(
        (feedback) => !/\s0\d/.test(feedback),
        "Bitte geben sie keine Telefonnummer ein.",
      )
      .refine(
        (feedback) => !feedback.includes("@"),
        "Bitte geben sie keine E-Mailadresse ein.",
      ),
  }),
);

export interface FeedbackBoxProps {
  readonly destination: string;
  readonly shouldFocus: boolean;
  readonly onSubmit: () => void;
}

export const FeedbackFormBox = ({
  destination,
  shouldFocus,
  onSubmit,
}: FeedbackBoxProps) => {
  const { translations } = useFeedbackTranslations();
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  const textAreaReference = useRef<HTMLTextAreaElement | null>(null);

  const heading = getTranslationByKey(
    HEADING_FEEDBACK_TRANSLATION_KEY,
    translations,
  );
  const placeholder = getTranslationByKey(
    PLACEHOLDER_FEEDBACK_TRANSLATION_KEY,
    translations,
  );

  const abortButtonLabel = getTranslationByKey(
    ABORT_BUTTON_FEEDBACK_TRANSLATION_KEY,
    translations,
  );
  const submitButtonLabel = getTranslationByKey(
    SUBMIT_BUTTON_FEEDBACK_TRANSLATION_KEY,
    translations,
  );

  useEffect(() => {
    if (shouldFocus && textAreaReference.current) {
      textAreaReference.current.focus();
    }
  }, [shouldFocus]);

  return (
    <ValidatedForm
      validator={feedbackValidator}
      subaction={feedbackFormName}
      method="post"
      action={`/action/send-feedback?url=${destination}&js=${String(jsAvailable)}`}
      preventScrollReset={true}
      onSubmit={onSubmit}
    >
      <div role="status" className="ds-stack-16">
        <Textarea
          name={feedbackFieldname}
          label={heading}
          classNameLabel="ds-label-01-bold"
          placeholder={placeholder}
          role="status"
          innerRef={textAreaReference}
        />
        <ButtonContainer>
          <Button
            iconLeft={<CloseIcon />}
            look="tertiary"
            name={feedbackButtonFieldname}
            value={FeedbackButtons.Abort}
            type="submit"
          >
            {abortButtonLabel}
          </Button>
          <Button
            look="primary"
            iconLeft={<SendIcon />}
            name={feedbackButtonFieldname}
            value={FeedbackButtons.Submit}
            type="submit"
          >
            {submitButtonLabel}
          </Button>
        </ButtonContainer>
      </div>
    </ValidatedForm>
  );
};
