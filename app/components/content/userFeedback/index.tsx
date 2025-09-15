import { useCallback, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router";
import { BACKGROUND_COLORS } from "~/components";
import { GridItem } from "~/components/layout/grid/GridItem";
import type { RootLoader } from "~/root";
import { type BannerState } from "./BannerState";
import { FeedbackFormBox } from "./FeedbackFormBox";
import { PostSubmissionBox } from "./PostSubmissionBox";
import { type RatingBoxProps, RatingBox } from "./RatingBox";

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
    <GridItem
      smColumn={{ start: 1, span: 12 }}
      mdColumn={{ start: 1, span: 7 }}
      lgColumn={{ start: 3, span: 7 }}
      xlColumn={{ start: 3, span: 7 }}
      className={`${BACKGROUND_COLORS.midBlue} rounded-lg py-24`}
    >
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
    </GridItem>
  );
}
