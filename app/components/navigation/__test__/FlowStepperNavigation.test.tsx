import { render } from "@testing-library/react";
import { FlowStepperNavigation } from "../FlowStepperNavigation";

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

      expect(getByRole("listitem")).toHaveClass("bg-blue-400 ds-label-03-bold");
      expect(getByRole("link").children[0]).toHaveClass(
        "bg-blue-800 text-white",
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
      const { getByRole, getByTestId } = render(
        <FlowStepperNavigation steps={doneSteps} />,
      );

      expect(getByRole("listitem")).toHaveClass("bg-blue-100");
      expect(getByRole("listitem")).toHaveClass("ds-label-03-reg");
      expect(getByTestId("triangle")).toHaveClass("text-gray-100");
    });

    it("should have an icon done", () => {
      const { getByTestId } = render(
        <FlowStepperNavigation steps={doneSteps} />,
      );

      expect(getByTestId("icon-done")).toBeInTheDocument();
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

      expect(getByRole("listitem")).toHaveClass("bg-blue-400 ds-label-03-bold");
    });

    it("should have a done icon", () => {
      const { getByTestId } = render(
        <FlowStepperNavigation steps={doneCurrentSteps} />,
      );

      expect(getByTestId("icon-done")).toBeInTheDocument();
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
      const { getByRole, getByTestId } = render(
        <FlowStepperNavigation steps={openSteps} />,
      );

      expect(getByRole("listitem")).toHaveClass("bg-blue-100");
      expect(getByRole("link").children[0]).toHaveClass(
        "bg-blue-800 text-white",
      );
      expect(getByTestId("triangle")).toHaveClass("text-gray-100");
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
        "bg-blue-100 text-gray-600 curser-not-allowed pointer-events-none",
      );
      expect(getByRole("link").children[0]).toHaveClass(
        "bg-gray-600 text-white",
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
        "bg-yellow-200 active:bg-yellow-300 arrow-step-warning",
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
        "bg-blue-400 ds-label-03-bold bg-yellow-200 active:bg-yellow-300 arrow-step-warning",
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
