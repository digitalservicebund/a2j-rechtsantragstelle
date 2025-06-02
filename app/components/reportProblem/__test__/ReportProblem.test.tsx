import { fireEvent, render } from "@testing-library/react";
import type { Survey } from "posthog-js";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { fetchSurvey } from "~/services/analytics/fetchSurveys";

describe("ReportProblem", () => {
  vi.mock("~/services/analytics/fetchSurveys");

  it("should trigger the Survey popup", () => {
    vi.mocked(fetchSurvey).mockReturnValue({
      questions: [],
    } as unknown as Survey);
    const { getByRole, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeVisible();
    fireEvent.click(reportButton);
    expect(getByText("Abbrechen")).toBeInTheDocument();
    expect(getByText("Problem absenden")).toBeInTheDocument();
  });

  it("should not render if the survey isn't available", () => {
    vi.mocked(fetchSurvey).mockReturnValue(undefined);
    const { queryByRole } = render(<ReportProblem />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });
});
