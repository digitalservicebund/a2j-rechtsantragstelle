import { useLocation, useRouteLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";
import type { RootLoader } from "~/root";
import { FeedbackFormBox } from "./FeedbackFormBox";
import { PostSubmissionBox } from "./PostSubmissionBox";
import { type RatingBoxProps, RatingBox } from "./RatingBox";
import Background from "../Background";
import Container from "../Container";

export enum BannerState {
  ShowRating = "showRating",
  ShowFeedback = "showFeedback",
  FeedbackGiven = "feedbackGiven",
}

export type UserFeedbackProps = {
  rating: Pick<RatingBoxProps, "heading">;
};

export const USER_FEEDBACK_ID = "user-feedback-banner";

export enum FeedbackType {
  Positive = "positive",
  Negative = "negative",
}

export default function UserFeedback(props: Readonly<UserFeedbackProps>) {
  const { pathname } = useLocation();
  const [shouldFocus, setShouldFocus] = useState(false);
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");
  const bannerState =
    rootLoaderData?.feedback.state[pathname] ?? BannerState.ShowRating;
  const feedbackResult = rootLoaderData?.feedback.result
    ? FeedbackType.Positive
    : FeedbackType.Negative;

  const applyFocus = useCallback(() => {
    setShouldFocus(true);
  }, []);

  return (
    <Background paddingTop="32" paddingBottom="40">
      <Container
        paddingTop="32"
        paddingBottom="32"
        overhangingBackground
        backgroundColor="midBlue"
        fullScreen={false}
      >
        <div
          className="ds-stack-16"
          data-testid={USER_FEEDBACK_ID}
          id={USER_FEEDBACK_ID}
        >
          {
            {
              [BannerState.ShowRating]: (
                <RatingBox
                  url={pathname}
                  heading={props.rating.heading}
                  onSubmit={applyFocus}
                />
              ),
              [BannerState.ShowFeedback]: (
                <FeedbackFormBox
                  destination={pathname}
                  shouldFocus={shouldFocus}
                  feedback={feedbackResult}
                  onSubmit={applyFocus}
                />
              ),
              [BannerState.FeedbackGiven]: (
                <PostSubmissionBox shouldFocus={shouldFocus} />
              ),
            }[bannerState]
          }
        </div>
      </Container>
    </Background>
  );
}
