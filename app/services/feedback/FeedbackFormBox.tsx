import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";
import Button from "~/components/Button";
import ButtonContainer from "~/components/ButtonContainer";
import Heading from "~/components/Heading";
import Textarea from "~/components/Textarea";

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
        (feedback) => !/\s0[0-9]/.test(feedback),
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
  abortButtonText: string;
  submitButtonText: string;
}

export const FeedbackFormBox = ({
  destination,
  heading,
  placeholder,
  abortButtonText,
  submitButtonText,
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
            {abortButtonText}
          </Button>
          <Button
            look="primary"
            iconLeft={<SendIcon />}
            name={feedbackButtonFieldname}
            value={FeedbackButtons.Submit}
            type="submit"
          >
            {submitButtonText}
          </Button>
        </ButtonContainer>
      </div>
    </ValidatedForm>
  </>
);
