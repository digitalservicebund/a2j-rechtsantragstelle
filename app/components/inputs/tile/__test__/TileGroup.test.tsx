import { useField } from "@rvf/react-router";
import { render, screen } from "@testing-library/react";
import TileGroup from "~/components/inputs/tile/TileGroup";

const COMPONENT_NAME = "TileGroup";

const mockControlledRef = vi.fn();

const mockUseField = (error?: string) => ({
  getInputProps: vi.fn((props) => ({ ...props })),
  error: vi.fn().mockReturnValue(error),
  getControlProps: vi.fn(),
  getHiddenInputProps: vi.fn(),
  refs: {
    controlled: () => mockControlledRef,
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

vi.mock("@rvf/react-router", () => ({
  useField: vi.fn(),
}));

const mockOptions = [
  { value: "value1", title: "Option 1" },
  { value: "value2", title: "Option 2" },
];

const mockErrorMessages = [
  { code: "required", text: "This field is required" },
];

describe("TileGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useField).mockImplementation(() => mockUseField());
  });

  it("renders all tile options", () => {
    render(
      <TileGroup
        name={COMPONENT_NAME}
        options={mockOptions}
        errorMessages={mockErrorMessages}
      />,
    );

    mockOptions.forEach((option) => {
      expect(screen.getByText(option.title)).toBeInTheDocument();
    });
  });

  it("shows error message when error is present", () => {
    vi.mocked(useField).mockImplementation(() => mockUseField("required"));

    render(
      <TileGroup
        name={COMPONENT_NAME}
        options={mockOptions}
        errorMessages={mockErrorMessages}
      />,
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("passes controlled ref to first tile when there is an error", () => {
    vi.mocked(useField).mockImplementation(() => mockUseField("required"));

    render(
      <TileGroup
        name={COMPONENT_NAME}
        options={mockOptions}
        errorMessages={mockErrorMessages}
      />,
    );

    const firstRadio = screen.getAllByRole("radio")[0];
    expect(firstRadio).toBeInTheDocument();
    expect(mockControlledRef).toHaveBeenCalled();
  });

  it("sets aria attributes when error is present", () => {
    vi.mocked(useField).mockImplementation(() => mockUseField("required"));

    render(
      <TileGroup
        name={COMPONENT_NAME}
        options={mockOptions}
        errorMessages={mockErrorMessages}
      />,
    );

    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute("aria-invalid", "true");
    expect(fieldset).toHaveAttribute(
      "aria-describedby",
      `${COMPONENT_NAME}-error`,
    );
    expect(fieldset).toHaveAttribute(
      "aria-errormessage",
      `${COMPONENT_NAME}-error`,
    );
  });
});
