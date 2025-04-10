import { fireEvent, render } from "@testing-library/react";
import { ReportProblem } from "~/components/userFeedback/reportProblem/ReportProblem";

const reportProblem = "Problem melden";
const cancel = "Abbrechen";
const submitProblem = "Problem absenden";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "report-problem": reportProblem,
    cancel: cancel,
    "submit-problem": submitProblem,
    "open-feedback-placeholder": "Beschreibung des Problems....",
  }),
}));

vi.mock("~/services/analytics/PosthogContext", () => ({
  usePosthog: () => ({ fetchSurvey: vi.fn(() => ({ questions: [] })) }),
}));

describe("ReportProblem", () => {
  it("should render the Report Problem button with correct label", () => {
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    expect(reportButton.textContent).toBe(` ${reportProblem} `);
    expect(reportButton.id).toBe("survey-button");
  });

  it("should trigger the Survey popup", () => {
    const { getByRole, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    fireEvent.click(reportButton);
    expect(getByText(cancel)).toBeInTheDocument();
    expect(getByText(submitProblem)).toBeInTheDocument();
  });
});
