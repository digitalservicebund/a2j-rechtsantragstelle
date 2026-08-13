import { fireEvent, render } from "@testing-library/react";
import NumberIncrement from "~/components/formElements/inputs/number/NumberIncrement";
import NumberInput from "~/components/formElements/inputs/number/NumberInput";
import { useJsAvailable } from "~/components/hooks/useJsAvailable";

const mockError = vi.fn();
const mockSetValue = vi.fn();
const mockValue = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    error: mockError,
    value: mockValue,
    getInputProps: vi.fn(),
    setValue: mockSetValue,
    validate: vi.fn(),
  }),
}));

vi.mock("~/components/hooks/useJsAvailable");

describe("NumberIncrement", () => {
  beforeEach(() => {
    vi.mocked(useJsAvailable).mockReturnValue(true);
  });

  afterEach(() => {
    vi.resetAllMocks();
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

    expect(getByRole("spinbutton")).toHaveClass(
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
    mockValue.mockReturnValue(0);
    const { getByRole, getAllByRole } = render(
      <NumberIncrement name="amount" />,
    );
    const incrementButton = getAllByRole("button")[1];
    expect(getByRole("spinbutton")).toHaveValue(0);
    fireEvent.click(incrementButton);
    expect(mockSetValue).toHaveBeenCalledWith(1);
  });

  it("should disable the increment button if the value is at a given maximum", () => {
    mockValue.mockReturnValue(18);
    const { getByRole, getAllByRole } = render(
      <NumberIncrement name="amount" max={18} />,
    );
    const incrementButton = getAllByRole("button")[1];
    expect(incrementButton).toBeDisabled();
    expect(getByRole("spinbutton")).toHaveValue(18);
    fireEvent.click(incrementButton);
    expect(mockSetValue).not.toHaveBeenCalledWith(19);
  });

  it("should allow the user to decrement the value with the decrement button", () => {
    mockValue.mockReturnValue(1);
    const { getByRole, getAllByRole } = render(
      <NumberIncrement name="amount" />,
    );
    const decrementButton = getAllByRole("button")[0];
    expect(getByRole("spinbutton")).toHaveValue(1);
    fireEvent.click(decrementButton);
    expect(mockSetValue).toHaveBeenCalledWith(0);
  });

  it("should disable the decrement button if the value is at a given minimum", () => {
    const { getByRole, getAllByRole } = render(
      <NumberIncrement name="amount" min={10} />,
    );
    const decrementButton = getAllByRole("button")[0];
    expect(decrementButton).toBeDisabled();
    expect(getByRole("spinbutton")).toHaveValue(10);
    fireEvent.click(decrementButton);
    expect(mockSetValue).not.toHaveBeenCalledWith(9);
  });

  it("should display a basic spin button when JS is disabled", () => {
    vi.mocked(useJsAvailable).mockReturnValue(false);
    const { queryByRole } = render(<NumberIncrement name="amount" />);
    expect(queryByRole("button")).not.toBeInTheDocument();
  });

  it("should add increment correctly when min value is 1", () => {
    const { getByRole, getAllByRole } = render(
      <NumberIncrement name="amount" min={1} />,
    );
    const incrementButton = getAllByRole("button")[1];
    expect(getByRole("spinbutton")).toHaveValue(1);
    fireEvent.click(incrementButton);
    expect(mockSetValue).toHaveBeenCalledWith(2);
  });
});
