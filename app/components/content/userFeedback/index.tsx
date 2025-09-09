import { useCallback, useState } from "react";
import { useLocation, useRouteLoaderData } from "react-router";
import Background from "~/components/layout/Background";
import Container from "~/components/layout/Container";
import type { RootLoader } from "~/root";
import { type BannerState } from "./BannerState";
import { FeedbackFormBox } from "./FeedbackFormBox";
import { PostSubmissionBox } from "./PostSubmissionBox";
import { type RatingBoxProps, RatingBox } from "./RatingBox";
import { ContentGrid } from "~/components/ContentGrid";
import { GridItem } from "~/components/GridItem";
import { BACKGROUND_COLORS } from "~/components";
import classNames from "classnames";

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
    <ContentGrid
      className="py-40"
      background={{
        start: 1,
        span: 12,
        mdStart: 1,
        mdSpan: 8,
        lgStart: 2,
        lgSpan: 10,
        xlStart: 2,
        xlSpan: 10,
        className: classNames(BACKGROUND_COLORS.midBlue, "rounded-lg"),
      }}
    >
      <GridItem
        start={1}
        span={12}
        mdSpan={7}
        mdStart={1}
        lgStart={3}
        lgSpan={7}
        xlStart={3}
        xlSpan={7}
        className="[grid-row:1] z-10 pt-32 pb-32 px-32"
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
    </ContentGrid>
  );
}
