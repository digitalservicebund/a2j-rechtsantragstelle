import { type Session } from "@remix-run/node";
import { BannerState } from "~/components/userFeedback";
import { type FeedbackType } from "~/components/userFeedback/FeedbackType";

export const bannerStateName = "bannerState";
export const userRatingFieldName = "wasHelpful";

export const getFeedbackData = (session: Session, url: string) => {
  const state =
    (session.get(bannerStateName) as Record<string, BannerState>)?.[url] ??
    BannerState.ShowRating;

  const result =
    (session.get(userRatingFieldName) as Record<string, FeedbackType>)?.[url] ??
    undefined;

  return { result, state };
};
