import { render, screen } from "@testing-library/react";
import { InputLabel } from "../InputLabel";

describe("InputLabel", () => {
  it("should render label", () => {
    render(<InputLabel name="input-name" label="Input Label" />);
    expect(screen.getByText("Input Label")).toBeInTheDocument();
  });

  it("should display the correct suffix text", () => {
    render(
      <InputLabel name="input-name" label="Input Label" suffix="(optional)" />,
    );
    expect(screen.getByText("(optional)")).toBeInTheDocument();
  });
});
