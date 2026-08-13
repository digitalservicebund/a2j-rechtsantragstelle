import { render } from "@testing-library/react";
import TextInput from "../TextInput";
import { useField } from "@rvf/react-router";

vi.mock("@rvf/react-router");
vi.mocked(useField).mockImplementation(
  () =>
    ({
      value: vi.fn(),
      error: () => "required",
      getInputProps: () => ({
        id: "text",
        name: "text",
        inputMode: "text",
        value: "",
        defaultValue: "default",
        placeholder: "Enter text",
        onChange: vi.fn(),
      }),
    }) as any,
);

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

  it("should render suffix when provided", () => {
    const { getByText } = render(
      <TextInput name="text" label="Text" suffix="(e.g., John Doe)" />,
    );
    expect(getByText("(e.g., John Doe)")).toBeInTheDocument();
  });

  it("should apply max length when charLimit is provided", () => {
    const { getByRole } = render(<TextInput name="text" charLimit={10} />);
    expect(getByRole("textbox")).toHaveAttribute("maxlength", "10");
  });

  it("should render helper text linked with aria-describedby", () => {
    const { getByRole } = render(
      <TextInput name="text" helperText="Enter some text" />,
    );
    expect(getByRole("textbox")).toHaveAttribute(
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

  it("should set value when getInputProps.value() is provided", () => {
    vi.mocked(useField).mockReturnValue({
      error: () => "required",
      getInputProps: () => ({
        id: "text",
        name: "text",
        inputMode: "text",
        value: "value existing",
        defaultValue: "default",
        placeholder: "Enter text",
        onChange: vi.fn(),
      }),
    } as any);
    const { getByRole } = render(<TextInput name="text" controlled={false} />);

    expect(getByRole("textbox")).toHaveAttribute("value", "value existing");
  });

  it("should set value when as undefined when input is not controlled and getInputProps.value() is not provided ", () => {
    vi.mocked(useField).mockReturnValue({
      error: () => "required",
      getInputProps: () => ({
        id: "text",
        name: "text",
        inputMode: "text",
        value: undefined,
        defaultValue: "default",
        placeholder: "Enter text",
        onChange: vi.fn(),
      }),
    } as any);
    const { getByRole } = render(<TextInput name="text" controlled={false} />);

    expect(getByRole("textbox")).toHaveAttribute("value", undefined);
  });

  it("should set value from value() function when input is controlled and getInputProps.value() is not provided", () => {
    vi.mocked(useField).mockReturnValue({
      error: () => "required",
      getInputProps: () => ({
        id: "text",
        name: "text",
        inputMode: "text",
        value: undefined,
        defaultValue: "default",
        placeholder: "Enter text",
        onChange: vi.fn(),
      }),
      value: () => "some value from function",
    } as any);
    const { getByRole } = render(<TextInput name="text" controlled={true} />);

    expect(getByRole("textbox")).toHaveAttribute(
      "value",
      "some value from function",
    );
  });

  it("should set the default value when not controlled", () => {
    vi.mocked(useField).mockReturnValue({
      error: () => "required",
      getInputProps: () => ({
        id: "text",
        name: "text",
        inputMode: "text",
        value: undefined,
        defaultValue: "default",
        placeholder: "Enter text",
        onChange: vi.fn(),
      }),
    } as any);
    const { getByRole } = render(<TextInput name="text" controlled={false} />);

    expect((getByRole("textbox") as HTMLInputElement).defaultValue).toBe(
      "default",
    );
  });

  it("should not set defaultValue when controlled", () => {
    vi.mocked(useField).mockReturnValue({
      error: () => "required",
      getInputProps: () => ({
        id: "text",
        name: "text",
        inputMode: "text",
        value: undefined,
        defaultValue: "default",
        placeholder: "Enter text",
        onChange: vi.fn(),
      }),
      value: () => "",
    } as any);
    const { getByRole } = render(<TextInput name="text" controlled={true} />);
    expect((getByRole("textbox") as HTMLInputElement).defaultValue).toBe("");
  });
});
