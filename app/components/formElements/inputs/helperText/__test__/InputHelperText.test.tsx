import { InputHelperText } from "../InputHelperText";
import { render, screen } from "@testing-library/react";

describe("InputHelperText", () => {
  it("should render helper text", () => {
    render(<InputHelperText helperText="Helper Text" helperId="helper-id" />);
    expect(screen.getByText("Helper Text")).toBeInTheDocument();
  });
});
