import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { type Survey } from "posthog-js";
import { ReportProblem } from "../ReportProblem";

vi.mock("~/components/userFeedback/feedbackTranslations", () => ({
  useFeedbackTranslations: () => ({
    "report-problem": "Report a problem",
  }),
}));

vi.mock("~/services/env/web", () => ({
  config: () => ({
    POSTHOG_API_KEY: "test-api-key",
  }),
}));

vi.mock("~/components/reportProblem/Survey", () => ({
  PostHogSurvey: ({
    survey,
    closeSurvey,
  }: {
    survey: Survey;
    closeSurvey: () => void;
  }) => (
    <div data-testid="posthog-survey">
      Survey Opened: {survey?.id}
      <button onClick={closeSurvey}>Close</button>
    </div>
  ),
}));

const surveyResponse = {
  id: "survey-id",
  questions: [{ id: "test-question-id", question: "Question test?" }],
};

describe("ReportProblem", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should not render if fetch survey fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network error"));
    render(<ReportProblem />);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Report a problem" }),
      ).toBeNull();
    });
  });

  it("should not render if response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn(),
    });
    render(<ReportProblem />);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Report a problem" }),
      ).toBeNull();
    });
  });

  it("should render Report a problem button after successful fetch", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => surveyResponse,
    });
    render(<ReportProblem />);
    expect(
      await screen.findByRole("button", { name: "Report a problem" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("FlagOutlinedIcon")).toBeInTheDocument();
  });

  it("should trigger survey open when Report a problem button is clicked", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => surveyResponse,
    });
    render(<ReportProblem />);
    const button = await screen.findByRole("button", {
      name: "Report a problem",
    });
    fireEvent.click(button);
    expect(await screen.findByTestId("posthog-survey")).toBeInTheDocument();
    expect(screen.getByText(/survey opened: survey-id/i)).toBeInTheDocument();
  });

  it("should trigger survey close when Close button is clicked", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => surveyResponse,
    });
    render(<ReportProblem />);
    const button = await screen.findByRole("button", {
      name: "Report a problem",
    });
    fireEvent.click(button);
    const closeBtn = await screen.findByText("Close");
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByTestId("posthog-survey")).toBeNull();
    });
  });
});
