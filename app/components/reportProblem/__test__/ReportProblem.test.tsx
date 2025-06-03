import { fireEvent, render } from "@testing-library/react";
import type { PostHog, Survey } from "posthog-js";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";

describe("ReportProblem", () => {
  it("should trigger the Survey popup", () => {
    vi.mock("~/services/analytics/fetchSurveys");
    vi.mock("~/services/analytics/useAnalytics");

    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);

    vi.mocked(useAnalytics).mockReturnValue({
      posthogClient: {} as PostHog,
    });

    const { getByRole, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeVisible();
    fireEvent.click(reportButton);
    expect(getByText("Abbrechen")).toBeInTheDocument();
    expect(getByText("Problem absenden")).toBeInTheDocument();
  });

  it("should render null if the survey isn't available", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce(undefined);
    const { container } = render(<ReportProblem />);
    expect(container.firstChild).toBeNull();
  });

  it("should not render without posthog client", () => {
    const { container } = render(<ReportProblem />);
    expect(container.firstChild).toBeNull();
  });
});
