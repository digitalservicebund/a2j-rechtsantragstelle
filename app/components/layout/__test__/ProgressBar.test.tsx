import { render } from "@testing-library/react";
import { ProgressBar } from "~/components/layout/ProgressBar";

describe("ProgressBar", () => {
  it("should render the progress bar with correct attributes", () => {
    const { getByRole, getByLabelText, getByText } = render(
      <ProgressBar
        progress={2}
        max={5}
        fallback="Progress"
        label="Progress Label"
      />,
    );
    const progressBar = getByRole("progressbar");
    const label = getByLabelText("Progress Label");
    expect(progressBar).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("value", "2");
    expect(progressBar).toHaveAttribute("max", "5");
    expect(progressBar).toHaveAttribute("aria-valuemin", "1");
    expect(progressBar).toHaveAttribute("aria-valuenow", "2");
    expect(progressBar).toHaveAttribute("aria-valuemax", "5");
    expect(progressBar).toHaveAttribute("aria-label", "Progress");
    expect(getByText("Schritt 2 von 5")).toBeInTheDocument();
  });

  it("should correctly handle undefined values for progress and max", () => {
    const { getByRole, queryByText } = render(
      <ProgressBar progress={undefined} max={undefined} fallback="Progress" />,
    );
    const progressBar = getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).not.toHaveAttribute("value");
    expect(progressBar).not.toHaveAttribute("max");
    expect(progressBar).not.toHaveAttribute("aria-valuenow");
    expect(progressBar).not.toHaveAttribute("aria-valuemax");
    expect(progressBar).toHaveAttribute("aria-label", "Progress");
    expect(queryByText(/Schritt/)).not.toBeInTheDocument();
  });
});
