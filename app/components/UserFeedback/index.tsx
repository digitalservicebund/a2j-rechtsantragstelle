import { useLocation, useRouteLoaderData } from "@remix-run/react";
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

type UserFeedbackProps = {
  rating: Pick<RatingBoxProps, "heading">;
};

export const USER_FEEDBACK_ID = "user-feedback-banner";

export default function UserFeedback(props: Readonly<UserFeedbackProps>) {
  const { pathname } = useLocation();

  const rootLoaderData = useRouteLoaderData<RootLoader>("root");
  const bannerState = rootLoaderData?.bannerState ?? BannerState.ShowRating;

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
                <RatingBox url={pathname} {...props.rating} />
              ),
              [BannerState.ShowFeedback]: (
                <FeedbackFormBox destination={pathname} />
              ),
              [BannerState.FeedbackGiven]: <PostSubmissionBox />,
            }[bannerState]
          }
        </div>
      </Container>
    </Background>
  );
}
