import { render } from "@testing-library/react";
import TextInput from "../TextInput";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    error: () => "required",
    getInputProps: () => ({
      id: "text",
      name: "text",
      inputMode: "text",
      value: "",
      placeholder: "Enter text",
      onChange: vi.fn(),
    }),
  }),
}));

describe("TextInput", () => {
  it("should render input with correct attributes", () => {
    const { getByRole } = render(<TextInput name={"text"} />);
    expect(getByRole("textbox")).toHaveAttribute("name", "text");
    expect(getByRole("textbox")).toHaveAttribute("id", "text");
    expect(getByRole("textbox")).toHaveAttribute("inputmode", "text");
  });

  it("should render label when provided", () => {
    const { getByText } = render(<TextInput name="text" label="Text" />);
    expect(getByText("Text")).toBeInTheDocument();
  });

  it("should apply max length when charLimit is provided", () => {
    const { getByRole } = render(<TextInput name="text" charLimit={10} />);
    expect(getByRole("textbox")).toHaveAttribute("maxlength", "10");
  });

  it("should render helper text linked with aria-describedby", () => {
    const { getByRole, getByText } = render(
      <TextInput name="text" helperText="Enter some text" />,
    );
    const input = getByRole("textbox");
    const helperText = getByText("Enter some text");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "text-error text-helper ",
    );
  });

  it("should mark input as invalid when a error happens", () => {
    const { getByRole } = render(<TextInput name="text" />);
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("should show matching error message from errorMessages", () => {
    const { getByText } = render(
      <TextInput
        name="text"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByText("This field is required")).toBeInTheDocument();
  });

  it("should set aria-required when there is a required error", () => {
    const { getByRole } = render(
      <TextInput
        name="text"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByRole("textbox")).toHaveAttribute("aria-required", "true");
  });

  it("should mark input as readonly when readonly prop is true", () => {
    const { getByRole } = render(<TextInput name="text" readonly />);
    expect(getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("should apply ref when inputRef is provided", () => {
    const ref = { current: null };
    const { getByRole } = render(<TextInput name="text" inputRef={ref} />);
    expect(ref.current).toBe(getByRole("textbox"));
  });
});
