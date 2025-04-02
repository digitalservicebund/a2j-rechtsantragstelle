import { fireEvent, render } from "@testing-library/react";
import { ReportProblem } from "~/components/userFeedback/ReportProblem";

const reportProblem = "Problem melden";
const cancel = "Abbrechen";
const submitProblem = "Problem absenden";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "report-problem": reportProblem,
    cancel: cancel,
    "submit-problem": submitProblem,
  }),
}));

vi.mock("posthog-js", () => ({
  posthog: {
    init: vi.fn(),
  },
}));

vi.mock("~/services/analytics/posthogHelpers", () => ({
  fetchSurvey: vi.fn(() => ({})),
}));

describe("ReportProblem", () => {
  it("should render the Report Problem button with correct label", () => {
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    expect(reportButton.textContent).toBe(` ${reportProblem} `);
    expect(reportButton.id).toBe("survey-button");
  });

  it("should trigger the Survey popup", async () => {
    const { getByRole, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    fireEvent.click(reportButton);
    expect(getByText(cancel)).toBeInTheDocument();
    expect(getByText(submitProblem)).toBeInTheDocument();
  });
});
