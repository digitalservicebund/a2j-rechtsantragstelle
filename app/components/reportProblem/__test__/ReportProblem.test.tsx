import { fireEvent, render } from "@testing-library/react";
import type { PostHog, Survey } from "posthog-js";
import { ReportProblem } from "~/components/reportProblem/ReportProblem";
import { fetchSurvey } from "~/services/analytics/surveys/fetchSurveys";
import { useAnalytics } from "~/services/analytics/useAnalytics";

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
    expect(document.body.className).toBe("flex flex-col modal-open");
    expect(getByText("Problem absenden")).toBeInTheDocument();
  });

  it("should close the Survey popup on repeated click", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);
    const { getByRole, queryByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    fireEvent.click(reportButton);
    fireEvent.click(reportButton);
    expect(queryByText("Abbrechen")).not.toBeInTheDocument();
    expect(queryByText("Problem absenden")).not.toBeInTheDocument();
  });

  it("should close the Survey popup on pressing ESC", () => {
    vi.mocked(fetchSurvey).mockReturnValueOnce({
      questions: [],
    } as unknown as Survey);
    const { getByRole, queryByText } = render(<ReportProblem />);
    const reportButton = getByRole("button");
    fireEvent.click(reportButton);
    fireEvent.keyUp(reportButton, { key: "Escape" });
    expect(document.body.className).toBe("flex flex-col modal-closed");
    expect(queryByText("Abbrechen")).not.toBeInTheDocument();
    expect(queryByText("Problem absenden")).not.toBeInTheDocument();
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
