import { render } from "@testing-library/react";
import TimeInput from "../TimeInput";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    error: () => "required",
    getInputProps: () => ({
      id: "time",
      name: "time",
      inputMode: "numeric",
      value: "",
      placeholder: "Enter time",
      onChange: vi.fn(),
    }),
  }),
}));

describe("TimeInput", () => {
  it("should render input with correct attributes", () => {
    const { getByRole } = render(<TimeInput name={"time"} />);
    expect(getByRole("textbox")).toHaveAttribute("name", "time");
    expect(getByRole("textbox")).toHaveAttribute("id", "time");
    expect(getByRole("textbox")).toHaveAttribute("inputmode", "numeric");
  });

  it("should render input with name and placeholder", () => {
    const { getByPlaceholderText } = render(
      <TimeInput name="time" placeholder="HH:MM" />,
    );
    expect(getByPlaceholderText("HH:MM")).toBeInTheDocument();
    expect(getByPlaceholderText("HH:MM")).toHaveAttribute("name", "time");
    expect(getByPlaceholderText("HH:MM")).toHaveAttribute("type", "text");
    expect(getByPlaceholderText("HH:MM")).toHaveAttribute(
      "inputmode",
      "numeric",
    );
  });

  it("should render helper text linked with aria-describedby", () => {
    const { getByRole } = render(
      <TimeInput name="time" helperText="Enter time in HH:MM format" />,
    );
    expect(getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "time-error time-helper",
    );
  });
  it("should mark input as invalid when a error happens", () => {
    const { getByRole } = render(<TimeInput name="time" />);
    expect(getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("should show matching error message from errorMessages", () => {
    const { getByText } = render(
      <TimeInput
        name="time"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByText("This field is required")).toBeInTheDocument();
  });
});
