import { type Session } from "@remix-run/node";
import { BannerState } from "~/components/userFeedback";

export const bannerStateName = "bannerState";
export const userRatingFieldName = "wasHelpful";

export const getFeedbackBannerState = (session: Session, url: string) => {
  const getSessionForFeedbackState =
    (session.get(bannerStateName) as Record<string, BannerState>) ??
    BannerState.ShowRating;

  const getSessionForFeedbackResult =
    (session.get(userRatingFieldName)?.[url] as Record<string, BannerState>) ??
    undefined;

  return {
    result: getSessionForFeedbackResult,
    state: getSessionForFeedbackState,
  };
};
