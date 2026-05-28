import { render } from "@testing-library/react";
import { FlowStepperNavigation } from "../FlowStepperNavigation";

describe("FlowStepperNavigation", () => {
  it("should render correct number of steps", () => {
    const steps = [
      {
        label: "First step",
        href: "/",
        state: "Current" as const,
      },
      {
        label: "Second step",
        href: "/",
        state: "Current" as const,
      },
      {
        label: "Third step",
        href: "/",
        state: "Current" as const,
      },
    ];

    const { container } = render(<FlowStepperNavigation steps={steps} />);
    expect(container).toHaveTextContent("First step");
    expect(container).toHaveTextContent("Second step");
    expect(container).toHaveTextContent("Third step");
  });

  it("should render nothing when empty", () => {
    const { container } = render(<FlowStepperNavigation steps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the correct styles for current state", () => {
    const currentSteps = [
      {
        label: "Step",
        href: "/",
        state: "Current" as const,
      },
    ];
    const { getByRole } = render(
      <FlowStepperNavigation steps={currentSteps} />,
    );

    expect(getByRole("listitem")).toHaveClass(
      "border-kern-neutral-300 bg-kern-neutral-100",
    );
    expect(getByRole("link").children[0]).toHaveClass(
      "bg-kern-action-default text-white",
    );
  });

  it("should render the correct styles for done state", () => {
    const doneSteps = [
      {
        label: "Step",
        href: "/",
        state: "Done" as const,
      },
    ];
    const { getByRole } = render(<FlowStepperNavigation steps={doneSteps} />);

    expect(getByRole("listitem")).toHaveClass("border-kern-neutral-300");
  });

  it("should render the correct styles for doneCurrent state", () => {
    const doneCurrentSteps = [
      {
        label: "Step",
        href: "/",
        state: "DoneCurrent" as const,
      },
    ];
    const { getByRole } = render(
      <FlowStepperNavigation steps={doneCurrentSteps} />,
    );

    expect(getByRole("listitem")).toHaveClass(
      "bg-kern-neutral-200 font-semibold",
    );
  });

  it("should render the correct styles for open state", () => {
    const openSteps = [
      {
        label: "Step",
        href: "/",
        state: "Open" as const,
      },
    ];
    const { getByRole } = render(<FlowStepperNavigation steps={openSteps} />);

    expect(getByRole("listitem")).toHaveClass("bg-kern-neutral-025");
    expect(getByRole("link").children[0]).toHaveClass(
      "bg-kern-action-default text-white",
    );
  });

  it("should render the correct styles for disabled state", () => {
    const disabledSteps = [
      {
        label: "Step",
        href: "/",
        state: "Disabled" as const,
      },
    ];
    const { getByRole } = render(
      <FlowStepperNavigation steps={disabledSteps} />,
    );

    expect(getByRole("listitem")).toHaveClass(
      "bg-kern-neutral-025 text-kern-neutral-400 pointer-events-none",
    );
    expect(getByRole("link").children[0]).toHaveClass(
      "bg-kern-neutral-400 text-white",
    );
  });

  it("should render the correct styles for warning state", () => {
    const warningSteps = [
      {
        label: "Step",
        href: "/",
        state: "Warning" as const,
      },
    ];
    const { getByRole } = render(
      <FlowStepperNavigation steps={warningSteps} />,
    );

    expect(getByRole("listitem")).toHaveClass(
      "bg-kern-feedback-warning-background hover:bg-kern-orange-100 stepper-step",
    );
  });

  it("should render the correct styles for warningCurrent state", () => {
    const warningCurrentSteps = [
      {
        label: "Step",
        href: "/",
        state: "WarningCurrent" as const,
      },
    ];
    const { getByRole } = render(
      <FlowStepperNavigation steps={warningCurrentSteps} />,
    );

    expect(getByRole("listitem")).toHaveClass(
      "bg-kern-orange-100 font-semibold stepper-step",
    );
  });
});
