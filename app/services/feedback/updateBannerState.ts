import type { Session, SessionData } from "react-router";
import { type BannerState } from "~/components/content/userFeedback/BannerState";
import { bannerStateName } from "./getFeedbackData";

export function updateBannerState(
  session: Session<SessionData, SessionData>,
  newBannerState: BannerState,
  url: string,
) {
  const bannerStates =
    (session.get(bannerStateName) as Record<string, BannerState>) ?? {};
  bannerStates[url] = newBannerState;
  session.set(bannerStateName, bannerStates);
}
