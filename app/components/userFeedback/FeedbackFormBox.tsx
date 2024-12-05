import CloseIcon from "@digitalservicebund/icons/CloseOutlined";
import SendIcon from "@digitalservicebund/icons/SendOutlined";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useRef, useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { useFeedbackTranslations } from "./feedbackTranslations";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import Textarea from "../inputs/Textarea";

const FEEDBACK_BUTTON_FIELD_NAME = "feedbackButton";
export const FEEDBACK_FORM_NAME = "feedbackForm";
export const FEEDBACK_FIELD_NAME = "feedback";

enum FeedbackButtons {
  Abort = "abort",
  Submit = "submit",
}

export const feedbackValidator = withZod(
  z.object({
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
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

  const textAreaReference = useRef<HTMLTextAreaElement | null>(null);

  const feedbackTranslations = useFeedbackTranslations();

  useEffect(() => {
    if (shouldFocus && textAreaReference.current) {
      textAreaReference.current.focus();
    }
  }, [shouldFocus]);

  return (
    <ValidatedForm
      validator={feedbackValidator}
      subaction={FEEDBACK_FORM_NAME}
      method="post"
      action={`/action/send-feedback?url=${destination}&js=${String(jsAvailable)}`}
      preventScrollReset={true}
      onSubmit={onSubmit}
    >
      <div role="status" className="ds-stack-16">
        <Textarea
          name={FEEDBACK_FIELD_NAME}
          label={feedbackTranslations["heading-feedback"]}
          classNameLabel="ds-label-01-bold"
          placeholder={feedbackTranslations["placeholder-feedback"]}
          role="status"
          innerRef={textAreaReference}
          maxCharacterLimit={TEXTAREA_CHAR_LIMIT}
        />
        <ButtonContainer>
          <Button
            iconLeft={<CloseIcon />}
            look="tertiary"
            name={FEEDBACK_BUTTON_FIELD_NAME}
            value={FeedbackButtons.Abort}
            type="submit"
          >
            {feedbackTranslations["abort-button-feedback"]}
          </Button>
          <Button
            look="primary"
            iconLeft={<SendIcon />}
            name={FEEDBACK_BUTTON_FIELD_NAME}
            value={FeedbackButtons.Submit}
            type="submit"
          >
            {feedbackTranslations["submit-button-feedback"]}
          </Button>
        </ButtonContainer>
      </div>
    </ValidatedForm>
  );
};
