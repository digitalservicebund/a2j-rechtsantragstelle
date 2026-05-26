import { render, screen } from "@testing-library/react";
import { StepperContent } from "../StepperContent";

describe("StepperContent", () => {
  const baseProps = {
    label: "Step",
    href: "/",
    stepIndex: 0,
    totalSteps: 3,
  };

  it("should set aria-current for current state", () => {
    render(<StepperContent {...baseProps} state="Current" />);
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "step");
  });

  it("should set aria-disabled for disabled state", () => {
    render(<StepperContent {...baseProps} state="Disabled" />);
    expect(screen.getByRole("link")).toHaveAttribute("aria-disabled", "true");
  });

  it("should add aria-describedby for done state", () => {
    render(<StepperContent {...baseProps} state="Done" />);
    expect(screen.getByRole("link")).toHaveAttribute("aria-describedby");
  });

  it("should render label", () => {
    render(<StepperContent {...baseProps} state="Open" />);
    expect(screen.getByText("Step")).toBeInTheDocument();
  });

  it("should generate correct aria-label for current state", () => {
    render(<StepperContent {...baseProps} state="Current" />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Step 1 of 3"),
    );
  });
});
