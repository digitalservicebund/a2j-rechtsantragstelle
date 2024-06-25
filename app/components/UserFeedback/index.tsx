import { useLocation } from "@remix-run/react";
import { type FeedbackBoxProps, FeedbackFormBox } from "./FeedbackFormBox";
import {
  type PostSubmissionBoxProps,
  PostSubmissionBox,
} from "./PostSubmissionBox";
import { type RatingBoxProps, RatingBox } from "./RatingBox";
import Background from "../Background";
import Container from "../Container";

export enum BannerState {
  ShowRating = "showRating",
  ShowFeedback = "showFeedback",
  FeedbackGiven = "feedbackGiven",
}

type UserFeedbackProps = {
  bannerState: BannerState;
  rating: Omit<RatingBoxProps, "url">;
  feedback: Omit<FeedbackBoxProps, "destination">;
  postSubmission: PostSubmissionBoxProps;
};

export const USER_FEEDBACK_ID = "user-feedback-banner";

export default function UserFeedback(props: Readonly<UserFeedbackProps>) {
  const { pathname } = useLocation();

  return (
    <Background paddingTop="32" paddingBottom="40" backgroundColor="white">
      <Container
        paddingTop="32"
        paddingBottom="32"
        overhangingBackground
        backgroundColor="midBlue"
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
                <FeedbackFormBox destination={pathname} {...props.feedback} />
              ),
              [BannerState.FeedbackGiven]: (
                <PostSubmissionBox {...props.postSubmission} />
              ),
            }[props.bannerState]
          }
        </div>
      </Container>
    </Background>
  );
}
