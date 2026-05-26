import { render, screen } from "@testing-library/react";
import { StepperIcon } from "../StepperIcon";

describe("StepperIcon", () => {
  it("should render done icon", () => {
    render(<StepperIcon state="Done" stepIndex={0} />);
    expect(screen.getByTestId("icon-check-circle")).toBeInTheDocument();
  });

  it("should render warning icon", () => {
    render(<StepperIcon state="Warning" stepIndex={0} />);
    expect(screen.getByTestId("icon-warning")).toBeInTheDocument();
  });

  it("should render step number when default", () => {
    render(<StepperIcon state="Open" stepIndex={1} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
