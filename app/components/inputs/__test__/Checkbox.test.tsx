import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox, { CheckboxValue } from "../Checkbox";

const getErrorMock = vi.fn();

vi.mock("@rvf/remix", () => ({
  useField: () => ({
    getInputProps: vi.fn((props) => ({ ...props })),
    error: getErrorMock,
    defaultValue: vi.fn(),
  }),
}));

const mockError = (error: string) => {
  getErrorMock.mockReturnValue(error);
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Checkbox", () => {
  it("renders the checkbox with a label", () => {
    render(<Checkbox name="checkbox-name" label="Checkbox Label" required />);
    const checkbox = screen.getByRole("checkbox", { name: "Checkbox Label" });
    expect(checkbox).toBeInTheDocument();

    const label = screen.getByText("Checkbox Label");
    expect(label).toBeInTheDocument();
  });

  it("renders the hidden input when the checkbox is not checked", () => {
    render(
      <Checkbox name="checkbox-name" label="Another Checkbox Label" required />,
    );
    const hiddenInput = screen.getByDisplayValue(CheckboxValue.off);
    expect(hiddenInput).toBeInTheDocument();
  });

  it("hides the hidden input when the checkbox is checked", () => {
    render(
      <Checkbox name="checkbox-name" label="Another Checkbox Label" required />,
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const hiddenInput = screen.queryByDisplayValue(CheckboxValue.off);
    expect(hiddenInput).not.toBeInTheDocument();
  });

  it("displays an error message when an error exists", () => {
    mockError("checkbox error");

    render(
      <Checkbox
        name="checkbox-name"
        label="Checkbox Label"
        required
        errorMessage="checkbox error"
      />,
    );

    const errorMessage = screen.getByText("checkbox error");
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders the checkbox as required", () => {
    render(<Checkbox name="checkbox-name" label="Checkbox Label" required />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeRequired();
  });
});
