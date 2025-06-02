import { fireEvent, render } from "@testing-library/react";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { usePosthog } from "~/services/analytics/PosthogContext";

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
  usePosthog: vi.fn(),
}));

describe("ReportProblem", () => {
  it("should render the Report Problem button with correct label", () => {
    vi.mocked(usePosthog).mockReturnValue({
      posthogClient: undefined,
    });
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    expect(reportButton.textContent).toBe(` ${reportProblem} `);
    expect(reportButton.id).toBe("survey-button");
  });

  it("should trigger the Survey popup", () => {
    vi.mocked(usePosthog).mockReturnValue({
      posthogClient: undefined,
    });
    const { getByRole, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeInTheDocument();
    fireEvent.click(reportButton);
    expect(getByText(cancel)).toBeInTheDocument();
    expect(getByText(submitProblem)).toBeInTheDocument();
  });

  it("should not render if the survey isn't available", () => {
    vi.mocked(usePosthog).mockReturnValue({
      posthogClient: undefined,
    });
    const { queryByRole } = render(<ReportProblem />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });
});
