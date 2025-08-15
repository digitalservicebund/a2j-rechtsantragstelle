import { type Session } from "react-router";
import { type BannerState } from "~/components/content/userFeedback/BannerState";
import { type FeedbackType } from "~/components/content/userFeedback/FeedbackType";

export const bannerStateName = "bannerState";
export const userRatingFieldName = "wasHelpful";

export const getFeedbackData = (session: Session, url: string) => {
  const state =
    (session.get(bannerStateName) as Record<string, BannerState>)?.[url] ??
    "showRating";

  const result =
    (session.get(userRatingFieldName) as Record<string, FeedbackType>)?.[url] ??
    undefined;

  return { result, state };
};
