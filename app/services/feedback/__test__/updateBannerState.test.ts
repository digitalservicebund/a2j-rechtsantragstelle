import { createSession, type Session } from "react-router";
import { describe, test, expect } from "vitest";
import { bannerStateName } from "../getFeedbackData";
import { updateBannerState } from "../updateBannerState";

describe("updateBannerState", () => {
  test("should update the banner state for a given URL", () => {
    const mockSession: Session = createSession();
    const url = "existing-url";
    const value = { [url]: "showFeedback" };
    mockSession.set(bannerStateName, value);
    const newBannerState = "feedbackGiven";

    updateBannerState(mockSession, newBannerState, url);

    expect(mockSession.get(bannerStateName)).toStrictEqual({
      [url]: "feedbackGiven",
    });
  });
});
