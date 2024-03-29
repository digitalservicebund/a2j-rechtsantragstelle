import { useLocation } from "@remix-run/react";
import Background from "../Background";
import Container from "../Container";
import {
  type PostSubmissionBoxProps,
  PostSubmissionBox,
} from "./PostSubmissionBox";
import { type FeedbackBoxProps, FeedbackFormBox } from "./FeedbackFormBox";
import { type RatingBoxProps, RatingBox } from "./RatingBox";

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
        <div className="ds-stack-16" data-testid="user-feedback-banner">
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
