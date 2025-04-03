import { render } from "@testing-library/react";
import { ReportProblem } from "~/components/userFeedback/ReportProblem";

const REPORT_PROBLEM_BUTTON = "Problem melden";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "report-problem": REPORT_PROBLEM_BUTTON,
  }),
}));

describe("ReportProblem", () => {
  it("should render the Report Problem button with correct label", () => {
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    expect(reportButton.textContent).toBe(` ${REPORT_PROBLEM_BUTTON} `);
    expect(reportButton.id).toBe("survey-button");
  });
});
