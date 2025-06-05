import type { PostHog, Survey } from "posthog-js";
import { fetchSurvey } from "../fetchSurveys";

describe("fetchSurvey", () => {
  const mockSurvey = { id: "id" } as unknown as Survey;
  const getSurveys: PostHog["getSurveys"] = (cb) => cb([mockSurvey]);

  const mockPosthog: PostHog = { getSurveys } as unknown as PostHog;

  it("should return matching survey if available", () => {
    expect(fetchSurvey(mockSurvey.id, mockPosthog)).toBe(mockSurvey);
  });

  it("should return undefined without matching survey", () => {
    expect(fetchSurvey("notId", mockPosthog)).toBeUndefined();
  });

  it("should return undefined without posthog instance", () => {
    expect(fetchSurvey("")).toBeUndefined();
  });
});
