import { createSession, type Session } from "@remix-run/node";
import { describe, test, expect } from "vitest";
import { BannerState, FeedbackType } from "~/components/userFeedback";
import {
  bannerStateName,
  userRatingFieldName,
  getFeedbackData,
} from "../getFeedbackData";

describe("getFeedbackData", () => {
  test("should return correct banner state and positive feedback result for a given URL", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    mockSession.set(bannerStateName, { [url]: BannerState.ShowFeedback });
    mockSession.set(userRatingFieldName, { [url]: FeedbackType.Positive });

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual(BannerState.ShowFeedback);
    expect(result).toStrictEqual(FeedbackType.Positive);
  });

  test("should return correct banner state and negative feedback result for a given URL", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    mockSession.set(bannerStateName, { [url]: BannerState.ShowFeedback });
    mockSession.set(userRatingFieldName, { [url]: FeedbackType.Negative });

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual(BannerState.ShowFeedback);
    expect(result).toStrictEqual(FeedbackType.Negative);
  });

  test("should return default ShowRating state if session does not contain bannerState", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual(BannerState.ShowRating);
    expect(result).toBeUndefined();
  });

  test("should return undefined for result if session does not contain wasHelpful", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    mockSession.set(bannerStateName, { [url]: BannerState.ShowFeedback });

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual(BannerState.ShowFeedback);
    expect(result).toBeUndefined();
  });
});
