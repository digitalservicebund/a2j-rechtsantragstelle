import { fireEvent, render } from "@testing-library/react";
import { SurveyQuestionType, type PostHog, type Survey } from "posthog-js";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";
import { translations } from "~/services/translations/translations";

const mockDialogShow = vi.fn(function mock(this: HTMLDialogElement) {
  this.open = true;
});
const mockDialogClose = vi.fn(function mock(this: HTMLDialogElement) {
  this.open = false;
});

// Needed as jsdom doesn't support dialog API yet
// https://github.com/jsdom/jsdom/issues/3294
// Using this workaround: https://github.com/jsdom/jsdom/issues/3294#issuecomment-1268330372
HTMLDialogElement.prototype.showModal = mockDialogShow;
HTMLDialogElement.prototype.close = mockDialogClose;

vi.mock("~/services/analytics/surveys/fetchSurveys");
vi.mock("~/services/analytics/useAnalytics");

const mockFeedbackCapture = vi.fn();

describe("ReportProblem", () => {
  vi.mocked(useAnalytics).mockReturnValue({
    posthogClient: { capture: mockFeedbackCapture } as unknown as PostHog,
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should trigger the Survey popup", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);

    const { getByRole, getByText, getAllByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeVisible();
    fireEvent.click(reportButton);
    expect(getByText("Abbrechen")).toBeVisible();
    expect(
      getAllByText(translations.feedback["report-problem"].de)[0],
    ).toBeVisible();
    expect(getByText("Problem absenden")).toBeVisible();
    expect(mockDialogShow).toHaveBeenCalled();
  });

  it("should disable other page elements when the modal is open", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    fireEvent.click(reportButton);
    expect(mockDialogShow).toHaveBeenCalled();
    fireEvent.click(reportButton);
    expect(mockDialogClose).not.toHaveBeenCalled();
  });

  it("should close the Survey popup on pressing ESC", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    fireEvent.click(reportButton);
    fireEvent.keyUp(reportButton, { key: "Escape" });
    expect(getByRole("dialog")).toHaveAttribute("open", "");
  });

  it("should display a success message upon feedback submission", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      id: "0",
      questions: [
        {
          id: "1",
          type: SurveyQuestionType.MultipleChoice,
          choices: ["Choice 1", "Choice 2", "Choice 3"],
          required: true,
          question: "Multiple Choice Question",
        },
      ],
    } as unknown as Survey);
    const { getByRole, getByLabelText, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    const firstCheckbox = getByLabelText("Choice 1");
    const submitButton = getByText(translations.feedback["submit-problem"].de);
    fireEvent.click(reportButton);
    fireEvent.click(firstCheckbox);
    fireEvent.click(submitButton);
    expect(mockFeedbackCapture).toHaveBeenCalled();
    expect(
      getByText(translations.feedback["problem-gemeldet"].de),
    ).toBeVisible();
    expect(getByText(translations.feedback.close.de)).toBeVisible();
  });

  it("should render null if the survey isn't available", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce(undefined);
    const { container } = render(<ReportProblem />);
    expect(container.firstChild).toBeNull();
  });

  it("should not render without posthog client", () => {
    vi.mocked(useAnalytics).mockReturnValueOnce({ posthogClient: undefined });
    const { container } = render(<ReportProblem />);
    expect(container.firstChild).toBeNull();
  });
});
