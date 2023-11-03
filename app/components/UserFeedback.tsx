import { z } from "zod";
import Heading from "./Heading";
import Button from "./Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ButtonContainer from "./ButtonContainer";
import Background from "./Background";
import Container from "./Container";
import { useState, useEffect } from "react";
import RichText from "./RichText";
import { useFetcher, useLocation } from "@remix-run/react";

export const wasHelpfulFieldname = "wasHelpful";

const UserFeedbackPropsSchema = z.object({
  heading: z.string(),
  yesButtonLabel: z.string(),
  noButtonLabel: z.string(),
  successHeading: z.string(),
  successText: z.string(),
  showSuccess: z.boolean(),
});

type UserFeedbackProps = z.infer<typeof UserFeedbackPropsSchema>;

export default function UserFeedback({
  heading,
  yesButtonLabel,
  noButtonLabel,
  successHeading,
  successText,
  showSuccess,
}: Readonly<UserFeedbackProps>) {
  const url = useLocation().pathname;
  const wasHelpfulFetcher = useFetcher();
  const [clientJavaScriptAvailable, setClientJavaScriptAvailable] =
    useState(false);
  useEffect(() => {
    setClientJavaScriptAvailable(true);
  }, []);

  return (
    <Background paddingTop="32" paddingBottom="40" backgroundColor="white">
      <Container
        paddingTop="32"
        paddingBottom="32"
        overhangingBackground
        backgroundColor="midBlue"
      >
        <div className="ds-stack-16">
          {showSuccess ? (
            <>
              <Heading
                look="ds-label-01-bold"
                tagName="h2"
                text={successHeading}
              />
              <RichText markdown={successText} />
            </>
          ) : (
            <>
              <Heading look="ds-label-01-bold" tagName="h2" text={heading} />
              <wasHelpfulFetcher.Form
                method="post"
                action={`/action/send-feedback?url=${url}${
                  clientJavaScriptAvailable ? "&js=1" : ""
                }`}
              >
                <ButtonContainer>
                  <Button
                    iconLeft={<ThumbUpIcon />}
                    look="tertiary"
                    name={wasHelpfulFieldname}
                    value="yes"
                    type="submit"
                  >
                    {yesButtonLabel}
                  </Button>
                  <Button
                    iconLeft={<ThumbDownIcon />}
                    look="tertiary"
                    name={wasHelpfulFieldname}
                    value="no"
                    type="submit"
                  >
                    {noButtonLabel}
                  </Button>
                </ButtonContainer>
              </wasHelpfulFetcher.Form>
            </>
          )}
        </div>
      </Container>
    </Background>
  );
}
