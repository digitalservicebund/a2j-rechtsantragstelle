import { render } from "@testing-library/react";
import InputError from "../InputError";

describe("InputError", () => {
  it("should not render when children is empty", () => {
    const { queryByTestId } = render(<InputError id="err" />);
    expect(queryByTestId("inputError")).toBeNull();
  });

  it("should not render when children is null", () => {
    const { queryByTestId } = render(<InputError id="err">{null}</InputError>);
    expect(queryByTestId("inputError")).toBeNull();
  });
  it("should render the error message", () => {
    const { getByTestId } = render(
      <InputError id="err">Something went wrong</InputError>,
    );
    expect(getByTestId("inputError")).toBeInTheDocument();
  });
  it("should display the provided error text", () => {
    const { getByText } = render(
      <InputError id="err">Invalid input</InputError>,
    );
    expect(getByText("Invalid input")).toBeInTheDocument();
  });
  it("should have role alert for accessibility", () => {
    const { getByRole } = render(<InputError id="err">Error</InputError>);
    expect(getByRole("alert")).toBeInTheDocument();
  });
  it("should render the icon", () => {
    const { container } = render(<InputError id="err">Error</InputError>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
  it("should apply correct error class", () => {
    const { getByTestId } = render(<InputError id="err">Error</InputError>);
    expect(getByTestId("inputError")).toHaveClass("kern-error");
  });
});
