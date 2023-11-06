import { useEffect, useState } from "react";
import { useFetcher, useLocation } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import Background from "./Background";
import Button from "./Button";
import ButtonContainer from "./ButtonContainer";
import Container from "./Container";
import Heading from "./Heading";
import RichText from "./RichText";
import Textarea from "./Textarea";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import SendIcon from "@mui/icons-material/SendOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUpOutlined";

export const wasHelpfulFieldname = "wasHelpful";
export const feedbackFieldname = "feedback";
export const feedbackButtonFieldname = "feedbackButton";

export enum BannerState {
  ShowRating = "showRating",
  ShowFeedback = "showFeedback",
  FeedbackGiven = "feedbackGiven",
}

export enum FeedbackButtons {
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

type UserFeedbackProps = {
  heading: string;
  yesButtonLabel: string;
  noButtonLabel: string;
  successHeading: string;
  successText: string;
  bannerState: BannerState;
  feedbackHeading: string;
  feedbackPlaceholder: string;
  feedbackAbortButton: string;
  feedbackSubmitButton: string;
  context?: string | undefined;
};

export default function UserFeedback(props: Readonly<UserFeedbackProps>) {
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
          {props.bannerState === BannerState.ShowRating ? (
            <>
              <Heading
                look="ds-label-01-bold"
                tagName="h2"
                text={props.heading}
              />
              <wasHelpfulFetcher.Form
                method="post"
                action={`/action/send-rating?url=${url}&context=${
                  props.context ?? ""
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
                    {props.yesButtonLabel}
                  </Button>
                  <Button
                    iconLeft={<ThumbDownIcon />}
                    look="tertiary"
                    name={wasHelpfulFieldname}
                    value="no"
                    type="submit"
                  >
                    {props.noButtonLabel}
                  </Button>
                </ButtonContainer>
              </wasHelpfulFetcher.Form>
            </>
          ) : props.bannerState === BannerState.ShowFeedback ? (
            <>
              <Heading
                look="ds-label-01-bold"
                tagName="h2"
                text={props.feedbackHeading}
              />
              <ValidatedForm
                validator={feedbackValidator}
                method="post"
                action={`/action/send-feedback?url=${url}&context=${
                  props.context ?? ""
                }&js=${String(jsAvailable)}`}
              >
                <div className="ds-stack-16">
                  <Textarea
                    name={feedbackFieldname}
                    placeholder={props.feedbackPlaceholder}
                  />
                  <ButtonContainer>
                    <Button
                      iconLeft={<CloseIcon />}
                      look="tertiary"
                      name={feedbackButtonFieldname}
                      value={FeedbackButtons.Abort}
                      type="submit"
                    >
                      {props.feedbackAbortButton}
                    </Button>
                    <Button
                      look="primary"
                      iconLeft={<SendIcon />}
                      name={feedbackButtonFieldname}
                      value={FeedbackButtons.Submit}
                      type="submit"
                    >
                      {props.feedbackSubmitButton}
                    </Button>
                  </ButtonContainer>
                </div>
              </ValidatedForm>
            </>
          ) : props.bannerState === BannerState.FeedbackGiven ? (
            <>
              <Heading
                look="ds-label-01-bold"
                tagName="h2"
                text={props.successHeading}
              />
              <RichText markdown={props.successText} />
            </>
          ) : (
            <></>
          )}
        </div>
      </Container>
    </Background>
  );
}
