import { type Session } from "@remix-run/node";
import { BannerState } from "~/components/userFeedback";

export const bannerStateName = "bannerState";
export const userRatingFieldName = "wasHelpful";

export const getFeedbackState = (session: Session, url: string) => {
  const state =
    (session.get(bannerStateName) as Record<string, BannerState>) ??
    BannerState.ShowRating;

  const result =
    (session.get(userRatingFieldName)?.[url] as Record<string, BannerState>) ??
    undefined;

  return { result, state };
};
