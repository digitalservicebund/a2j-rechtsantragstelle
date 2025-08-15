import { createSession, type Session } from "react-router";
import { describe, test, expect } from "vitest";
import { type BannerState } from "~/components/content/userFeedback/BannerState";
import { type FeedbackType } from "~/components/content/userFeedback/FeedbackType";
import {
  bannerStateName,
  userRatingFieldName,
  getFeedbackData,
} from "../getFeedbackData";

describe("getFeedbackData", () => {
  test("should return correct banner state and positive feedback result for a given URL", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    mockSession.set(bannerStateName, { [url]: "showFeedback" as BannerState });
    mockSession.set(userRatingFieldName, { [url]: "positive" as FeedbackType });

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual("showFeedback");
    expect(result).toStrictEqual("positive");
  });

  test("should return correct banner state and negative feedback result for a given URL", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    mockSession.set(bannerStateName, { [url]: "showFeedback" as BannerState });
    mockSession.set(userRatingFieldName, { [url]: "negative" as FeedbackType });

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual("showFeedback");
    expect(result).toStrictEqual("negative");
  });

  test("should return default ShowRating state if session does not contain bannerState", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual("showRating");
    expect(result).toBeUndefined();
  });

  test("should return undefined for result if session does not contain wasHelpful", () => {
    const mockSession: Session = createSession();
    const url = "/hilfe";

    mockSession.set(bannerStateName, { [url]: "showFeedback" as BannerState });

    const { state, result } = getFeedbackData(mockSession, url);

    expect(state).toStrictEqual("showFeedback");
    expect(result).toBeUndefined();
  });
});
