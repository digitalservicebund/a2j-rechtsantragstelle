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

  it("should generate correct span with sr-only for current state", () => {
    const { container } = render(
      <StepperContent {...baseProps} state="Current" />,
    );

    const srOnlyElements = container.querySelectorAll(".sr-only");
    expect(srOnlyElements).toHaveLength(2);
    expect(srOnlyElements[0]).toHaveTextContent("Schritt 1 von 3");
    expect(srOnlyElements[1]).toHaveTextContent("current");
  });
});
