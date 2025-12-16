import { ValidatedForm } from "@rvf/react-router";
import { useEffect, useId, useRef } from "react";
import { useLocation } from "react-router";
import { z } from "zod";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";
import { TEXTAREA_CHAR_LIMIT } from "~/services/validation/inputlimits";
import { useFeedbackTranslations } from "./feedbackTranslations";
import { type FeedbackType } from "./types";
import KernTextarea from "../formElements/Textarea";
import KernButton from "../KernButton";

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
  const headingPersonalFeedbackId = useId();

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

  const textAreaDescription = `<p id="${headingPersonalFeedbackId}">${feedbackTranslations["heading-personal-data-feedback"]}</p>`;

  return (
    <ValidatedForm
      schema={feedbackSchema}
      defaultValues={{ feedback: "" }}
      method="post"
      action={`/action/send-feedback?url=${destination}&js=${String(jsAvailable)}`}
      preventScrollReset={true}
      onSubmit={onSubmit}
      className="w-full"
    >
      {(form) => (
        <div className="flex flex-col gap-kern-space-small!">
          <KernTextarea
            name={FEEDBACK_FIELD_NAME}
            label={
              <>
                <span>{feedbackTranslations["success-message"]}</span>{" "}
                {feedbackText}
              </>
            }
            description={textAreaDescription}
            placeholder={feedbackTranslations["placeholder-feedback"]}
            innerRef={textAreaReference}
            ariaDescribedby={headingPersonalFeedbackId}
          />
          <KernButton
            look="secondary"
            name={FEEDBACK_BUTTON_FIELD_NAME}
            value={"submit"}
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-kern-space-small! w-[154px]"
          >
            {feedbackTranslations["submit-button-feedback"]}
          </KernButton>
        </div>
      )}
    </ValidatedForm>
  );
};
