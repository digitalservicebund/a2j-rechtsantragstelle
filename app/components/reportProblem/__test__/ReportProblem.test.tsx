import { fireEvent, render } from "@testing-library/react";
import type { PostHog, Survey } from "posthog-js";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";

const mockDialogShow = vi.fn(function mock(this: HTMLDialogElement) {
  this.open = true;
});
const mockDialogClose = vi.fn(function mock(this: HTMLDialogElement) {
  this.open = false;
});

// Needed as jsdom doesn't support dialog API yet
// https://github.com/jsdom/jsdom/issues/3294
// Using this workaround: https://github.com/jsdom/jsdom/issues/3294#issuecomment-1268330372
HTMLDialogElement.prototype.show = mockDialogShow;
HTMLDialogElement.prototype.close = mockDialogClose;

vi.mock("~/services/analytics/surveys/fetchSurveys");
vi.mock("~/services/analytics/useAnalytics");

describe("ReportProblem", () => {
  vi.mocked(useAnalytics).mockReturnValue({
    posthogClient: {} as PostHog,
  });

  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should trigger the Survey popup", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);

    const { getByRole, getByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    expect(reportButton).toBeVisible();
    fireEvent.click(reportButton);
    expect(getByText("Abbrechen")).toBeInTheDocument();
    expect(document.body.className).toContain("modal-open");
    expect(getByText("Problem absenden")).toBeInTheDocument();
    expect(mockDialogShow).toHaveBeenCalled();
  });

  it("should close the Survey popup on repeated click", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);
    const { getByRole } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    fireEvent.click(reportButton);
    expect(mockDialogShow).toHaveBeenCalled();
    fireEvent.click(reportButton);
    expect(mockDialogClose).toHaveBeenCalled();
  });

  it("should close the Survey popup on pressing ESC", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);
    const { getByRole, queryByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    fireEvent.click(reportButton);
    fireEvent.keyUp(reportButton, { key: "Escape" });
    expect(document.body.className).not.toContain("modal-open");
    expect(queryByText("Abbrechen")).not.toBeVisible();
    expect(queryByText("Problem absenden")).not.toBeVisible();
    expect(mockDialogClose).toHaveBeenCalled();
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
