import { fireEvent, render } from "@testing-library/react";
import type { Survey } from "posthog-js";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { fetchSurvey } from "~/services/analytics/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";

describe("ReportProblem", () => {
  vi.mock("~/services/analytics/fetchSurveys");
  vi.mock("~/services/analytics/useAnalytics");

  vi.mocked(fetchSurvey).mockReturnValue({
    questions: [],
  } as unknown as Survey);
  vi.mocked(useAnalytics).mockReturnValue({
    posthogClient: undefined,
    hasTrackingConsent: true,
  });

  it("should trigger the Survey popup", () => {
    const { getByRole, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeVisible();
    fireEvent.click(reportButton);
    expect(getByText("Abbrechen")).toBeInTheDocument();
    expect(getByText("Problem absenden")).toBeInTheDocument();
  });

  it("should not render if the survey isn't available", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce(undefined);
    const { queryByRole } = render(<ReportProblem />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should not render without trackingConsent", () => {
    vi.mocked(useAnalytics).mockReturnValueOnce({
      posthogClient: undefined,
      hasTrackingConsent: false,
    });
    const { queryByRole } = render(<ReportProblem />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });
});
