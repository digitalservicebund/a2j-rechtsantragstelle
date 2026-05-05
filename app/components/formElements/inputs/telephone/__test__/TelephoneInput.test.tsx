import { render } from "@testing-library/react";
import TelephoneInput from "../TelephoneInput";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    error: () => "required",
    getInputProps: () => ({
      id: "tel",
      name: "tel",
      inputMode: "tel",
      value: "",
      placeholder: "Enter telephone number",
      onChange: vi.fn(),
    }),
  }),
}));

describe("TelephoneInput", () => {
  it("should render input with correct attributes", () => {
    const { getByRole } = render(<TelephoneInput name={"tel"} />);
    expect(getByRole("textbox")).toHaveAttribute("name", "tel");
    expect(getByRole("textbox")).toHaveAttribute("id", "tel");
    expect(getByRole("textbox")).toHaveAttribute("inputmode", "tel");
  });

  it("should render label when provided", () => {
    const { getByText } = render(
      <TelephoneInput name="tel" label="Telephone" />,
    );
    expect(getByText("Telephone")).toBeInTheDocument();
  });

  it("should render helper text when provided", () => {
    const { getByText } = render(
      <TelephoneInput name="tel" helperText="Enter telephone number" />,
    );
    expect(getByText("Enter telephone number")).toBeInTheDocument();
  });

  it("should render helper text linked with aria-describedby", () => {
    const { getByRole } = render(
      <TelephoneInput name="tel" helperText="Enter telephone number" />,
    );
    expect(getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "tel-error tel-helper",
    );
  });

  it("should mark input as invalid when there is an error", () => {
    const { getByRole } = render(<TelephoneInput name="telephone" />);
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("should show matching error message from errorMessages", () => {
    const { getByText } = render(
      <TelephoneInput
        name="telephone"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByText("This field is required")).toBeInTheDocument();
  });

  it("should set aria-required when there is a required error", () => {
    const { getByRole } = render(
      <TelephoneInput
        name="telephone"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByRole("textbox")).toHaveAttribute("aria-required", "true");
  });

  it("should mark input as readonly when readonly prop is true", () => {
    const { getByRole } = render(<TelephoneInput name="telephone" readonly />);
    expect(getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("should apply placeholder when provided", () => {
    const { getByPlaceholderText } = render(
      <TelephoneInput name="telephone" placeholder="Enter telephone number" />,
    );
    expect(getByPlaceholderText("Enter telephone number")).toBeInTheDocument();
  });
});
