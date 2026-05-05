import { fireEvent, render } from "@testing-library/react";
import NumberIncrement from "~/components/formElements/inputs/number/NumberIncrement";
import NumberInput from "~/components/formElements/inputs/number/NumberInput";

const mockError = vi.fn();
const mockSetValue = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    error: mockError,
    value: vi.fn(),
    getInputProps: vi.fn(),
    setValue: mockSetValue,
    validate: vi.fn(),
  }),
}));

describe("NumberIncrement", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render input with correct attributes", () => {
    const { getByRole } = render(<NumberIncrement name={"amount"} />);
    expect(getByRole("spinbutton")).toHaveAttribute("name", "amount");
    expect(getByRole("spinbutton")).toHaveAttribute("id", "amount");
    expect(getByRole("spinbutton")).toHaveAttribute("type", "number");
  });

  it("should render label when provided", () => {
    const { getByText } = render(
      <NumberIncrement name="amount" label="Amount" />,
    );
    expect(getByText("Amount")).toBeInTheDocument();
  });

  it("should add error class when there is an error", () => {
    mockError.mockReturnValue("required");
    const { getByRole } = render(<NumberIncrement name="amount" />);

    expect(getByRole("spinbutton").parentElement).toHaveClass(
      "kern-form-input__input--error",
    );
  });

  it("should mark input as invalid when there is an error", () => {
    mockError.mockReturnValue("required");
    const { getByRole } = render(<NumberIncrement name="amount" />);
    expect(getByRole("spinbutton")).toHaveAttribute("aria-invalid", "true");
  });

  it("should show matching error message from errorMessages", () => {
    mockError.mockReturnValue("required");
    const { getByText } = render(
      <NumberInput
        name="amount"
        errorMessages={[{ code: "required", text: "This field is required" }]}
      />,
    );
    expect(getByText("This field is required")).toBeInTheDocument();
  });

  it("should allow the user to increment the value with the increment button", () => {
    const { getByRole, getAllByRole } = render(
      <NumberIncrement name="amount" />,
    );
    const incrementButton = getAllByRole("button")[1];
    expect(getByRole("spinbutton")).toHaveValue(0);
    fireEvent.click(incrementButton);
    expect(mockSetValue).toHaveBeenCalledWith(1);
  });

  it("should allow the user to decrement the value with the decrement button", () => {
    const { getByRole, getAllByRole } = render(
      <NumberIncrement name="amount" />,
    );
    const decrementButton = getAllByRole("button")[0];
    expect(getByRole("spinbutton")).toHaveValue(0);
    fireEvent.click(decrementButton);
    expect(mockSetValue).toHaveBeenCalledWith(-1);
  });
});
