import { createSession, type Session } from "@remix-run/node";
import { describe, test, expect } from "vitest";
import { BannerState } from "~/components/userFeedback";
import { bannerStateName } from "../getFeedbackState";
import { updateBannerState } from "../updateBannerState";

describe("updateBannerState", () => {
  test("should update the banner state for a given URL", () => {
    const mockSession: Session = createSession();
    const url = "existing-url";
    const value = { [url]: "showFeedback" };
    mockSession.set(bannerStateName, value);
    const newBannerState = BannerState.FeedbackGiven;

    updateBannerState(mockSession, newBannerState, url);

    expect(mockSession.get(bannerStateName)).toStrictEqual({
      [url]: "feedbackGiven",
    });
  });
});
