import type { Survey } from "posthog-js";
import { isCompleted } from "../isCompleted";

describe("isCompleted", () => {
  const mockSurvey = {
    questions: [
      { id: "1", optional: false },
      { id: "2", optional: false },
      { id: "3", optional: true },
    ],
  } as Survey;

  test("should return true if non-optional questions are answered", () => {
    const responses = { $survey_response_1: "a", $survey_response_2: ["a"] };
    expect(isCompleted(mockSurvey, responses)).toBe(true);
  });

  test("should return false if any non-optional questions is missing", () => {
    const responses = { $survey_response_1: "a" };
    expect(isCompleted(mockSurvey, responses)).toBe(false);
  });
  test("should return false if any non-optional questions is empty array", () => {
    const responses = { $survey_response_1: "a", $survey_response_2: [] };
    expect(isCompleted(mockSurvey, responses)).toBe(false);
  });
});
