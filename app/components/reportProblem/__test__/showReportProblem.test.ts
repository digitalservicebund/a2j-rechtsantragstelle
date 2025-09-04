import { shouldShowReportProblem } from "~/components/reportProblem/showReportProblem";

describe("shouldShowReportProblem", () => {
  it("should return false if the stepId ends with /start", () => {
    expect(shouldShowReportProblem("/step1/start")).toBe(false);
  });

  it("should return true if the stepId does not end with /start", () => {
    expect(shouldShowReportProblem("/step1")).toBe(true);
  });
});
