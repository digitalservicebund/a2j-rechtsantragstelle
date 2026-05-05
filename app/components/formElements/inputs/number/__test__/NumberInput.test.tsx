import NumberInput from "../NumberInput";
import { render } from "@testing-library/react";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    error: () => "required",
    getInputProps: () => ({
      id: "amount",
      name: "amount",
      inputMode: "decimal",
      step: "0.01",
      value: "",
      placeholder: "Enter amount",
      onChange: vi.fn(),
    }),
  }),
}));

describe("NumberInput", () => {
  it("should render input with correct attributes", () => {
    const { getByRole } = render(<NumberInput name={"amount"} />);
    expect(getByRole("textbox")).toHaveAttribute("name", "amount");
    expect(getByRole("textbox")).toHaveAttribute("id", "amount");
    expect(getByRole("textbox")).toHaveAttribute("inputmode", "decimal");
  });

  it("should render label when provided", () => {
    const { getByText } = render(<NumberInput name="amount" label="Amount" />);
    expect(getByText("Amount")).toBeInTheDocument();
  });

  it("should render helper text when provided", () => {
    const { getByText } = render(
      <NumberInput name="amount" helperText="Enter an amount" />,
    );
    expect(getByText("Enter an amount")).toBeInTheDocument();
  });

  it("should render helper text linked with aria-describedby", () => {
    const { getByRole, getByText } = render(
      <NumberInput name="amount" helperText="Enter an amount" />,
    );
    const input = getByRole("textbox");
    const helperText = getByText("Enter an amount");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "amount-error amount-helper",
    );
  });

  it("should add error class when there is an error", () => {
    const { getByRole } = render(<NumberInput name="amount" />);
    expect(getByRole("textbox")).toHaveClass("kern-form-input__input--error");
  });

  it("should mark input as invalid when there is an error", () => {
    const { getByRole } = render(<NumberInput name="amount" />);
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("should show matching error message from errorMessages", () => {
    const { getByText } = render(
      <NumberInput
        name="amount"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByText("This field is required")).toBeInTheDocument();
  });

  it("should set aria-required when there is a required error", () => {
    const { getByRole } = render(
      <NumberInput
        name="amount"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByRole("textbox")).toHaveAttribute("aria-required", "true");
  });

  it("should mark input as readonly when readonly prop is true", () => {
    const { getByRole } = render(<NumberInput name="amount" readonly />);
    expect(getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("should apply step attribute when provided", () => {
    const { getByRole } = render(<NumberInput name="amount" step="0.01" />);
    expect(getByRole("textbox")).toHaveAttribute("step", "0.01");
  });

  it("should apply placeholder when provided", () => {
    const { getByPlaceholderText } = render(
      <NumberInput name="amount" placeholder="Enter amount" />,
    );
    expect(getByPlaceholderText("Enter amount")).toBeInTheDocument();
  });
});
