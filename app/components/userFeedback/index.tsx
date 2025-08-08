import { useCallback, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router";
import type { RootLoader } from "~/root";
import { FeedbackFormBox } from "./FeedbackFormBox";
import { PostSubmissionBox } from "./PostSubmissionBox";
import { type RatingBoxProps, RatingBox } from "./RatingBox";
import Background from "../Background";
import Container from "../Container";
import { type BannerState } from "./BannerState";
import GridContainer, { GridItem } from "../GridContainer";

type UserFeedbackProps = {
  rating: Pick<RatingBoxProps, "heading">;
};

export const USER_FEEDBACK_ID = "user-feedback-banner";

export default function UserFeedback(props: Readonly<UserFeedbackProps>) {
  const { pathname } = useLocation();
  const [shouldFocus, setShouldFocus] = useState(false);
  const rootLoaderData = useRouteLoaderData<RootLoader>("root");
  const bannerState =
    rootLoaderData?.feedback.state ?? ("showRating" as BannerState);
  const feedbackResult = rootLoaderData?.feedback.result
    ? "positive"
    : "negative";

  const applyFocus = useCallback(() => {
    setShouldFocus(true);
  }, []);

  return (
    <GridContainer
      columns={12}
      maxWidth="full"
      alignItems="start"
      justifyContent="start"
    >
      <GridItem
        span={12}
        colStart={1}
        className="bg-blue-300 px-32 py-32 rounded-lg"
      >
        {/* <Background paddingTop="32" paddingBottom="40"> */}
        {/* <Container
          paddingTop="32"
          paddingBottom="32"
          overhangingBackground
          // backgroundColor="midBlue"
          fullScreen={false}
        > */}
        <div
          className="ds-stack ds-stack-16"
          data-testid={USER_FEEDBACK_ID}
          id={USER_FEEDBACK_ID}
        >
          {
            {
              ["showRating"]: (
                <RatingBox
                  url={pathname}
                  heading={props.rating.heading}
                  onSubmit={applyFocus}
                />
              ),
              ["showFeedback"]: (
                <FeedbackFormBox
                  destination={pathname}
                  shouldFocus={shouldFocus}
                  feedback={feedbackResult}
                  onSubmit={applyFocus}
                />
              ),
              ["feedbackGiven"]: (
                <PostSubmissionBox
                  shouldFocus={shouldFocus}
                  postSubmissionText={rootLoaderData?.postSubmissionText}
                />
              ),
            }[bannerState]
          }
        </div>
        {/* </Container> */}
        {/* </Background> */}
      </GridItem>
    </GridContainer>
  );
}
