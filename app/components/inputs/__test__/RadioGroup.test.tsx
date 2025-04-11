import { useField } from "@rvf/remix";
import { render, screen, fireEvent } from "@testing-library/react";
import RadioGroup from "../RadioGroup";

vi.mock("@rvf/remix", () => ({
  useField: vi.fn(),
}));

const mockUseField = (error?: string): void => {
  vi.mocked(useField).mockReturnValue({
    getInputProps: vi.fn((props) => ({ ...props })),
    error: vi.fn().mockReturnValue(error),
    getControlProps: vi.fn(),
    getHiddenInputProps: vi.fn(),
    refs: {
      controlled: vi.fn(),
      transient: vi.fn(),
    },
    name: vi.fn(),
    onChange: vi.fn(),
    onBlur: vi.fn(),
    value: vi.fn(),
    setValue: vi.fn(),
    defaultValue: vi.fn(),
    touched: vi.fn(),
    setTouched: vi.fn(),
    dirty: vi.fn(),
    setDirty: vi.fn(),
    clearError: vi.fn(),
    reset: vi.fn(),
    validate: vi.fn(),
  });
};

const mockOptions = [
  { value: "option1", text: "Option 1" },
  { value: "option2", text: "Option 2" },
];

const mockErrorMessages = [
  { code: "required", text: "This field is required" },
];

const renderRadioGroup = (props = {}) => {
  return render(
    <RadioGroup
      name="test"
      options={mockOptions}
      label="Test Label"
      errorMessages={mockErrorMessages}
      {...props}
    />,
  );
};

describe("RadioGroup", () => {
  beforeEach(() => {
    mockUseField();
  });

  it("renders all radio options", () => {
    renderRadioGroup();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders alt label when provided", () => {
    renderRadioGroup({ altLabel: "Alt Label" });
    expect(screen.getByText("Alt Label")).toBeInTheDocument();
  });

  it("shows error message when error is present", () => {
    mockUseField("required");
    renderRadioGroup();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("handles radio selection", () => {
    renderRadioGroup();
    const radio = screen.getByLabelText("Option 1");
    fireEvent.click(radio);
    expect(radio).toBeChecked();
  });

  it("sets aria-invalid when there is an error", () => {
    mockUseField("required");
    renderRadioGroup();
    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute("aria-invalid", "true");
  });
});
