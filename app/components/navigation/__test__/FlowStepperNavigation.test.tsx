import { render } from "@testing-library/react";
import { FlowStepperNavigation } from "../FlowStepperNavigation/FlowStepperNavigation";

describe("FlowStepperNavigation", () => {
  it("should render three steps", () => {
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

  it("should render empty if the steps are empty", () => {
    const { container } = render(<FlowStepperNavigation steps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("state Current", () => {
    const currentSteps = [
      {
        label: "Step",
        href: "/",
        state: "Current" as const,
      },
    ];

    it("should have the correct styles", () => {
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

    it("should have aria-current for the link as true", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={currentSteps} />,
      );
      expect(getByRole("link")).toHaveAttribute("aria-current", "true");
    });

    it("should have the step number", () => {
      const { container } = render(
        <FlowStepperNavigation steps={currentSteps} />,
      );

      expect(container).toHaveTextContent("1");
    });
  });

  describe("state Done", () => {
    const doneSteps = [
      {
        label: "Step",
        href: "/",
        state: "Done" as const,
      },
    ];

    it("should have the correct styles", () => {
      const { getByRole } = render(<FlowStepperNavigation steps={doneSteps} />);

      expect(getByRole("listitem")).toHaveClass("border-kern-neutral-300");
    });

    it("should have an icon done", () => {
      const { getByTestId } = render(
        <FlowStepperNavigation steps={doneSteps} />,
      );

      expect(getByTestId("icon-check-circle")).toBeInTheDocument();
    });

    it("should have an attribute aria-describedby for the link", () => {
      const { getByRole } = render(<FlowStepperNavigation steps={doneSteps} />);

      expect(getByRole("link")).toHaveAttribute("aria-describedby");
    });
  });

  describe("state DoneCurrent", () => {
    const doneCurrentSteps = [
      {
        label: "Step",
        href: "/",
        state: "DoneCurrent" as const,
      },
    ];

    it("should have the correct styles", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={doneCurrentSteps} />,
      );

      expect(getByRole("listitem")).toHaveClass(
        "bg-kern-neutral-200 font-semibold",
      );
    });

    it("should have a done icon", () => {
      const { getByTestId } = render(
        <FlowStepperNavigation steps={doneCurrentSteps} />,
      );

      expect(getByTestId("icon-check-circle")).toBeInTheDocument();
    });

    it("should have aria-current for the link as true", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={doneCurrentSteps} />,
      );
      expect(getByRole("link")).toHaveAttribute("aria-current", "true");
    });

    it("should have an attribute aria-describedby for the link", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={doneCurrentSteps} />,
      );

      expect(getByRole("link")).toHaveAttribute("aria-describedby");
    });
  });

  describe("state Open", () => {
    const openSteps = [
      {
        label: "Step",
        href: "/",
        state: "Open" as const,
      },
    ];

    it("should have the correct styles", () => {
      const { getByRole } = render(<FlowStepperNavigation steps={openSteps} />);

      expect(getByRole("listitem")).toHaveClass("bg-kern-neutral-025");
      expect(getByRole("link").children[0]).toHaveClass(
        "bg-kern-action-default text-white",
      );
    });

    it("should have the step number", () => {
      const { container } = render(<FlowStepperNavigation steps={openSteps} />);

      expect(container).toHaveTextContent("1");
    });
  });

  describe("state Disabled", () => {
    const disabledSteps = [
      {
        label: "Step",
        href: "/",
        state: "Disabled" as const,
      },
    ];

    it("should have the correct styles", () => {
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

    it("should have an attribute aria-disabled for the link", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={disabledSteps} />,
      );

      expect(getByRole("link")).toHaveAttribute("aria-disabled", "true");
    });

    it("should have the step number", () => {
      const { container } = render(
        <FlowStepperNavigation steps={disabledSteps} />,
      );

      expect(container).toHaveTextContent("1");
    });
  });

  describe("state Warning", () => {
    const warningSteps = [
      {
        label: "Step",
        href: "/",
        state: "Warning" as const,
      },
    ];

    it("should have the correct styles", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={warningSteps} />,
      );

      expect(getByRole("listitem")).toHaveClass(
        "bg-kern-feedback-warning-background hover:bg-kern-orange-100 stepper-step",
      );
    });

    it("should have an attribute aria-describedby for the link", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={warningSteps} />,
      );

      expect(getByRole("link")).toHaveAttribute("aria-describedby");
    });

    it("should have a warning icon", () => {
      const { getByTestId } = render(
        <FlowStepperNavigation steps={warningSteps} />,
      );

      expect(getByTestId("icon-warning")).toBeInTheDocument();
    });
  });

  describe("state WarningCurrent", () => {
    const warningCurrentSteps = [
      {
        label: "Step",
        href: "/",
        state: "WarningCurrent" as const,
      },
    ];

    it("should have the correct styles", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={warningCurrentSteps} />,
      );

      expect(getByRole("listitem")).toHaveClass(
        "bg-kern-orange-100 font-semibold stepper-step",
      );
    });

    it("should have aria-current for the link as true", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={warningCurrentSteps} />,
      );
      expect(getByRole("link")).toHaveAttribute("aria-current", "true");
    });

    it("should have an attribute aria-describedby for the link", () => {
      const { getByRole } = render(
        <FlowStepperNavigation steps={warningCurrentSteps} />,
      );

      expect(getByRole("link")).toHaveAttribute("aria-describedby");
    });

    it("should have a warning icon", () => {
      const { getByTestId } = render(
        <FlowStepperNavigation steps={warningCurrentSteps} />,
      );

      expect(getByTestId("icon-warning")).toBeInTheDocument();
    });
  });
});
