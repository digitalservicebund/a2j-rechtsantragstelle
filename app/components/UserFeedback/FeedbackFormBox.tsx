import CloseIcon from "@digitalservicebund/icons/CloseOutlined";
import SendIcon from "@digitalservicebund/icons/SendOutlined";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { getTranslationByKey } from "~/util/getTranslationByKey";
import { useFeedbackTranslations } from "./FeedbackTranslationContext";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import Heading from "../Heading";
import Textarea from "../inputs/Textarea";

export const feedbackFormName = "feedbackForm";
const feedbackFieldname = "feedback";
const feedbackButtonFieldname = "feedbackButton";

const HEADING_FEEDBACK_TRANSLATION_KEY = "heading-feedback";
const PLACEHOLDER_FEEDBACK_TRANSLATION_KEY = "placeholder-feedback";
const ABORT_BUTTON_FEEDBACK_TRANSLATION_KEY = "abort-button-feedback";
const SUBMIT_BUTTON_FEEDBACK_TRANSLATION_KEY = "submit-button-feedback";

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
}

export const FeedbackFormBox = ({ destination }: FeedbackBoxProps) => {
  const { translations } = useFeedbackTranslations();

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

  return (
    <>
      <Heading look="ds-label-01-bold" tagName="h2" text={heading} />
      <ValidatedForm
        validator={feedbackValidator}
        subaction={feedbackFormName}
        method="post"
        action={destination}
      >
        <div className="ds-stack-16">
          <Textarea name={feedbackFieldname} placeholder={placeholder} />
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
    </>
  );
};
