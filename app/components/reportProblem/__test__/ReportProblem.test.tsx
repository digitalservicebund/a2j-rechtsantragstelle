import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { ReportProblem } from "../ReportProblem";
import * as useSurveyModule from "../useSurvey";

vi.mock("../useSurvey", () => ({
  useSurvey: () => ({
    fetchSurvey: vi.fn(),
  }),
}));

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "report-problem": "Report a problem",
    close: "Close",
    submit: "Submit",
  }),
}));

vi.mock("~/components/reportProblem/Survey", () => ({
  PosthogSurvey: ({
    survey,
    closeSurvey,
  }: {
    survey: { id?: string };
    closeSurvey: () => void;
  }) => (
    <div data-testid="posthog-survey">
      <span>{survey?.id}</span>
      <button onClick={closeSurvey}>Close</button>
    </div>
  ),
}));

describe("ReportProblem", () => {
  let fetchSurveyMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSurveyMock = vi.fn();
    vi.spyOn(useSurveyModule, "useSurvey").mockReturnValue({
      fetchSurvey: fetchSurveyMock,
    });
  });

  it("should render the report problem button with correct text and icon", () => {
    render(<ReportProblem />);
    expect(
      screen.getByRole("button", { name: "Report a problem" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("FlagOutlinedIcon")).toBeInTheDocument();
  });

  it("should not render the survey initially", () => {
    render(<ReportProblem />);
    expect(screen.queryByTestId("posthog-survey")).not.toBeInTheDocument();
  });

  it("should fetch and show survey when report a problem button is clicked", async () => {
    const surveyData = {
      id: "123",
      questions: [{ id: "q1", question: "Test?" }],
    };
    fetchSurveyMock.mockResolvedValue(surveyData);

    render(<ReportProblem />);
    fireEvent.click(screen.getByRole("button", { name: "Report a problem" }));
    await waitFor(() => {
      expect(screen.getByTestId("posthog-survey")).toBeInTheDocument();
      expect(screen.getByText("123")).toBeInTheDocument();
    });
  });

  it("should not open survey if fetchSurvey returns null", async () => {
    fetchSurveyMock.mockResolvedValue(null);

    render(<ReportProblem />);
    fireEvent.click(screen.getByRole("button", { name: "Report a problem" }));

    await waitFor(() => {
      expect(screen.queryByTestId("posthog-survey")).not.toBeInTheDocument();
    });
  });

  it("should close the survey when close button is clicked", async () => {
    const surveyData = {
      id: "123",
      questions: [{ id: "q1", question: "Test?" }],
    };
    fetchSurveyMock.mockResolvedValue(surveyData);

    render(<ReportProblem />);
    fireEvent.click(screen.getByRole("button", { name: "Report a problem" }));

    await waitFor(() => {
      expect(screen.getByTestId("posthog-survey")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(screen.queryByTestId("posthog-survey")).not.toBeInTheDocument();
    });
  });
});
