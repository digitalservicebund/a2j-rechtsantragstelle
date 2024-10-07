import type { Session, SessionData } from "@remix-run/node";
import type { BannerState } from "~/components/userFeedback";
import { bannerStateName } from "./getFeedbackBannerState";

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
