import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  it("should render a progress bar with correct value and max", () => {
    render(<ProgressBar progress={2} max={5} fallback="Progress" />);

    const progress = screen.getByRole("progressbar");

    expect(progress).toHaveAttribute("value", "2");
    expect(progress).toHaveAttribute("max", "5");
    expect(progress).toHaveAttribute("aria-valuenow", "2");
    expect(progress).toHaveAttribute("aria-valuemax", "5");
    expect(progress).toHaveAttribute("aria-valuemin", "1");
  });

  it("should render the fallback as accessible name", () => {
    render(<ProgressBar progress={1} max={3} fallback="Step progress" />);
    expect(
      screen.getByRole("progressbar", { name: "Step progress" }),
    ).toBeInTheDocument();
  });

  it("should render a label when prop is provided", () => {
    render(
      <ProgressBar
        progress={3}
        max={4}
        fallback="Progress"
        label="Upload progress"
      />,
    );

    const label = screen.getByText("Upload progress");
    const progress = screen.getByRole("progressbar");

    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "progress-bar");
    expect(progress).toHaveAttribute("id", "progress-bar");
  });

  it("should not render a label when prop is not provided", () => {
    render(<ProgressBar progress={1} max={2} fallback="Progress" />);
    expect(screen.queryByText(/progress/i)).not.toBeInTheDocument();
  });
});
