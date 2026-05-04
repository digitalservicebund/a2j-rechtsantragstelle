import { render, screen } from "@testing-library/react";
import Select from "../Select";

const getErrorMock = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn().mockReturnValue({
      id: "selectId",
    }),
    error: getErrorMock,
  }),
}));

describe("Select", () => {
  it("should render options", () => {
    const options = [
      { value: "1", text: "One" },
      { value: "2", text: "Two" },
    ];
    render(<Select name="select" options={options} />);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("should render label when provided", () => {
    render(<Select name="select" options={[]} label="My Label" />);
    expect(screen.getByText("My Label")).toBeInTheDocument();
  });

  it("should render placeholder when provided", () => {
    render(
      <Select name="select" options={[]} placeholder="Select something" />,
    );
    const placeholder = screen.getByText("Select something");
    expect(placeholder).toBeDisabled();
    expect(placeholder).toHaveValue("");
  });

  it("should apply error class when field has error", () => {
    getErrorMock.mockReturnValue("required");
    render(<Select name="select" options={[]} />);
    expect(screen.getByTestId("select-wrapper")).toHaveClass(
      "kern-form-input__select-wrapper--error",
    );
  });
  it("should have aria-required attribute set to true if errorMessages contain inputRequired", () => {
    render(
      <Select
        name="select"
        options={[]}
        label="Test Label"
        errorMessages={[{ code: "required", text: "error" }]}
      />,
    );
    const element = screen.getByRole("combobox");
    expect(element).toHaveAttribute("aria-required", "true");
  });

  it("should have aria-required attribute set to false if errorMessages do not contain inputRequired", () => {
    render(
      <Select
        name="select"
        options={[]}
        label="Test Label"
        errorMessages={undefined}
      />,
    );
    const element = screen.getByRole("combobox");
    expect(element).toHaveAttribute("aria-required", "false");
  });
});
