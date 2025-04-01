import { fireEvent, render, waitFor } from "@testing-library/react";
import {
  feedbackSurveyId,
  ReportProblem,
} from "~/components/userFeedback/ReportProblem";

const REPORT_PROBLEM_BUTTON = "Problem melden";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "report-problem": REPORT_PROBLEM_BUTTON,
  }),
}));

vi.mock("posthog-js", () => ({
  posthog: {
    init: vi.fn(),
    getSurveys: vi.fn(() => [
      {
        id: feedbackSurveyId,
      },
    ]),
  },
}));

describe("ReportProblem", () => {
  it("should render the Report Problem button with correct label", () => {
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    expect(reportButton.textContent).toBe(` ${REPORT_PROBLEM_BUTTON} `);
    expect(reportButton.id).toBe("survey-button");
  });

  it.skip("should trigger the Survey popup", async () => {
    const { getByRole, getByTestId } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    fireEvent.click(reportButton);
    await waitFor(() => {
      expect(getByTestId("posthog-survey")).toBeInTheDocument();
    });
  });
});
