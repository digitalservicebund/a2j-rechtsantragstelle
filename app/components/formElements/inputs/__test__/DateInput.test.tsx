import { render, screen } from "@testing-library/react";
import DateInput from "~/components/formElements/inputs/DateInput";

const getErrorMock = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn((props) => ({ ...props })),
    error: getErrorMock,
  }),
}));

describe("DateInput", () => {
  it("should render date input", () => {
    render(<DateInput name="birthdate" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render label if provided", () => {
    render(<DateInput name="birthdate" label="Birthdate" />);
    expect(screen.getByText("Birthdate")).toBeInTheDocument();
  });

  it("should render default placeholder", () => {
    render(<DateInput name="birthdate" />);
    expect(screen.getByPlaceholderText("TT.MM.JJJJ")).toBeInTheDocument();
  });

  it("should render helper text if provided", () => {
    render(<DateInput name="birthdate" helperText="Enter your birthdate" />);
    expect(screen.getByText("Enter your birthdate")).toBeInTheDocument();
  });

  it("should mark input as invalid when there is an error", () => {
    getErrorMock.mockReturnValue("required");
    render(<DateInput name="birthdate" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("kern-form-input__input--error");
  });

  it("should show matching error message from errorMessages", () => {
    getErrorMock.mockReturnValue("required");
    render(
      <DateInput
        name="birthdate"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
