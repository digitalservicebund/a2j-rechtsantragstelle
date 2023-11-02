import { z } from "zod";
import Heading, { HeadingPropsSchema } from "./Heading";
import Button from "./Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ButtonContainer from "./ButtonContainer";
import Background from "./Background";
import Container from "./Container";
import { type FormEvent, useEffect, useState } from "react";
import RichText, { RichTextPropsSchema } from "./RichText";

const UserFeedbackPropsSchema = z.object({
  heading: HeadingPropsSchema,
  yesButtonLabel: z.string(),
  noButtonLabel: z.string(),
  successHeading: HeadingPropsSchema,
  successText: RichTextPropsSchema,
});

type UserFeedbackProps = z.infer<typeof UserFeedbackPropsSchema>;

export default function UserFeedback({
  heading,
  yesButtonLabel,
  noButtonLabel,
  successHeading,
  successText,
}: UserFeedbackProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientJavaScriptAvailable, setClientJavaScriptAvailable] =
    useState(false);

  useEffect(() => {
    setClientJavaScriptAvailable(true);
  }, []);

  const submitFeedbackYes = (event: FormEvent) => {
    console.log("YES");
    // posthog call?
    setShowSuccess(true);
    event.preventDefault();
  };

  const submitFeedbackNo = (event: FormEvent) => {
    console.log("NO");
    // posthog call?
    setShowSuccess(true);
    event.preventDefault();
  };

  if (!clientJavaScriptAvailable) {
    return null;
  }

  return (
    <Background paddingTop="32" paddingBottom="40">
      <form onSubmit={submitFeedbackYes} id="formYes"></form>
      <form onSubmit={submitFeedbackNo} id="formNo"></form>
      <Container
        paddingTop="32"
        paddingBottom="32"
        overhangingBackground
        backgroundColor="blue"
      >
        <div className="ds-stack-16">
          {showSuccess ? (
            <>
              <Heading {...successHeading} />
              <RichText {...successText} />
            </>
          ) : (
            <>
              <Heading {...heading} />
              <ButtonContainer>
                <Button
                  iconLeft={<ThumbUpIcon />}
                  look="tertiary"
                  form="formYes"
                >
                  {yesButtonLabel}
                </Button>
                <Button
                  iconLeft={<ThumbDownIcon />}
                  look="tertiary"
                  form="formNo"
                >
                  {noButtonLabel}
                </Button>
              </ButtonContainer>
            </>
          )}
        </div>
      </Container>
    </Background>
  );
}
