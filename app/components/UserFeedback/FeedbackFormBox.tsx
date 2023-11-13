import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import Heading from "../Heading";
import Textarea from "../Textarea";

export const feedbackFormName = "feedbackForm";
const feedbackFieldname = "feedback";
const feedbackButtonFieldname = "feedbackButton";

enum FeedbackButtons {
  Abort = "abort",
  Submit = "submit",
}

export const feedbackValidator = withZod(
  z.object({
    feedback: z
      .string()
      .refine(
        (feedback) => !/\s0[\d]/.test(feedback),
        "Bitte geben sie keine Telefonnummer ein.",
      )
      .refine(
        (feedback) => !feedback.includes("@"),
        "Bitte geben sie keine E-Mailadresse ein.",
      ),
  }),
);

export interface FeedbackBoxProps {
  destination: string;
  heading: string;
  placeholder: string;
  abortButtonLabel: string;
  submitButtonLabel: string;
}

export const FeedbackFormBox = ({
  destination,
  heading,
  placeholder,
  abortButtonLabel,
  submitButtonLabel,
}: FeedbackBoxProps) => (
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
