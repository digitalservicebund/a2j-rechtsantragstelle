import { createSession, type Session } from "@remix-run/node";
import { describe, test, expect } from "vitest";
import { BannerState } from "~/components/userFeedback";
import {
  bannerStateName,
  userRatingFieldName,
  getFeedbackData,
} from "../getFeedbackData";

describe("getFeedbackData", () => {
  test("should return correct banner state and feedback result for a given URL", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    // Mock session data
    mockSession.set(bannerStateName, { [url]: BannerState.ShowFeedback });
    mockSession.set(userRatingFieldName, { [url]: BannerState.FeedbackGiven });

    // Call function
    const { state, result } = getFeedbackData(mockSession, url);

    // Expectations
    expect(state).toStrictEqual({ "/hilfe": BannerState.ShowFeedback });
    expect(result).toStrictEqual(BannerState.FeedbackGiven);
  });

  test("should return default ShowRating state if session does not contain bannerState", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    // Call function without setting bannerState
    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual(BannerState.ShowRating);
    expect(result).toBeUndefined();
  });

  test("should return undefined for result if session does not contain wasHelpful", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    // Mock banner state but no wasHelpful
    mockSession.set(bannerStateName, { [url]: BannerState.ShowFeedback });

    // Call function
    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual({ "/hilfe": BannerState.ShowFeedback });
    expect(result).toBeUndefined();
  });
});
