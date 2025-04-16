import { useField } from "@rvf/react-router";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox, { CheckboxValue } from "../Checkbox";

const createMockFieldReturn = (overrides = {}) => ({
  getInputProps: vi.fn((props) => ({ ...props })),
  error: vi.fn(),
  defaultValue: vi.fn(),
  refs: {
    transient: vi.fn(),
    controlled: vi.fn(),
  },
  getControlProps: vi.fn(),
  getHiddenInputProps: vi.fn(),
  name: vi.fn(),
  onChange: vi.fn(),
  onBlur: vi.fn(),
  value: vi.fn(),
  setValue: vi.fn(),
  touched: vi.fn(),
  setTouched: vi.fn(),
  dirty: vi.fn(),
  setDirty: vi.fn(),
  clearError: vi.fn(),
  reset: vi.fn(),
  validate: vi.fn(),
  ...overrides,
});

vi.mock("@rvf/react-router", () => ({
  useField: vi.fn(() => createMockFieldReturn()),
}));

const mockedUseField = vi.mocked(useField);

describe("Checkbox", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedUseField.mockImplementation(() => createMockFieldReturn());
  });

  it("renders the checkbox with a label", () => {
    render(<Checkbox name="checkbox-name" label="Checkbox Label" />);
    const checkbox = screen.getByRole("checkbox", { name: "Checkbox Label" });
    expect(checkbox).toBeInTheDocument();

    const label = screen.getByText("Checkbox Label");
    expect(label).toBeInTheDocument();
  });

  it("renders the hidden input when the checkbox is not checked", () => {
    render(<Checkbox name="checkbox-name" label="Another Checkbox Label" />);
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
    mockedUseField.mockImplementation(() =>
      createMockFieldReturn({
        error: () => "checkbox error",
      }),
    );

    render(
      <Checkbox
        name="checkbox-name"
        label="Checkbox Label"
        errorMessage="checkbox error"
      />,
    );

    const errorMessage = screen.getByText("checkbox error");
    expect(errorMessage).toBeInTheDocument();
  });

  it("sets aria-required to true when required is true", () => {
    render(
      <Checkbox name="checkbox-name" label="Checkbox Label" required={true} />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-required", "true");
  });

  it("does set aria-required to false when required is false", () => {
    render(
      <Checkbox name="checkbox-name" label="Checkbox Label" required={false} />,
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-required", "false");
  });

  it("renders label with RichText component", () => {
    const htmlLabel = "<span>Rich Text Label</span>";
    render(<Checkbox name="checkbox-name" label={htmlLabel} />);
    const labelElement = screen.getByText("Rich Text Label");
    expect(labelElement.tagName).toBe("SPAN");
  });

  it("calls controlled ref when there is an error", () => {
    const controlledRefMock = vi.fn();
    const transientRefMock = vi.fn();

    mockedUseField.mockImplementation(() =>
      createMockFieldReturn({
        error: () => "some error",
        refs: {
          controlled: controlledRefMock,
          transient: transientRefMock,
        },
      }),
    );

    render(
      <Checkbox
        name="checkbox-name"
        label="Checkbox Label"
        errorMessage="some error"
      />,
    );

    expect(controlledRefMock).toHaveBeenCalled();
  });
});
