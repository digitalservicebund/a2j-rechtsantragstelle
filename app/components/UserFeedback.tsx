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

type UserFeedbackProps = {
  heading: string;
  yesButtonLabel: string;
  noButtonLabel: string;
  successHeading: string;
  successText: string;
  showSuccess: boolean;
  context?: string | undefined;
};

export default function UserFeedback({
  heading,
  yesButtonLabel,
  noButtonLabel,
  successHeading,
  successText,
  showSuccess,
  context,
}: Readonly<UserFeedbackProps>) {
  const url = useLocation().pathname;
  const wasHelpfulFetcher = useFetcher();
  const [jsAvailable, setJsAvailable] = useState(false);
  useEffect(() => setJsAvailable(true), []);

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
                action={`/action/send-rating?url=${url}&context=${
                  context ?? ""
                }&js=${String(jsAvailable)}`}
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
