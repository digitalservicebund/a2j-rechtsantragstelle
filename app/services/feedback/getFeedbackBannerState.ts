import { type Session } from "@remix-run/node";
import { BannerState } from "~/components/UserFeedback";

export const bannerStateName = "bannerState";

export const getFeedbackBannerState = (session: Session, url: string) => {
  const getSessionForFeedbackState = session.get(bannerStateName) as Record<
    string,
    BannerState
  >;
  if (getSessionForFeedbackState) {
    return getSessionForFeedbackState[url];
  }
};
