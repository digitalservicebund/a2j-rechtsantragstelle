import { createRemixStub } from "@remix-run/testing";
import { render, screen, fireEvent } from "@testing-library/react";
import { ValidatedForm } from "remix-validated-form";
import { useStringField } from "~/services/validation/useStringField";
import RadioGroup from "../RadioGroup";

vi.mock("~/services/validation/useStringField", () => ({
  useStringField: vi.fn(),
}));

const createUseStringFieldMock = (error?: string) => ({
  error,
  defaultValue: undefined,
  clearError: vi.fn(),
  validate: vi.fn(),
  touched: false,
  setTouched: vi.fn(),
  getInputProps: vi.fn((props) => ({ ...props })),
});

const mockOptions = [
  { value: "option1", text: "Option 1" },
  { value: "option2", text: "Option 2" },
];

const mockErrorMessages = [
  { code: "required", text: "This field is required" },
];

const renderRadioGroup = (props = {}) => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: () => (
        <ValidatedForm validator={{ validate: vi.fn() }} method="post">
          <RadioGroup
            name="test"
            options={mockOptions}
            label="Test Label"
            errorMessages={mockErrorMessages}
            {...props}
          />
        </ValidatedForm>
      ),
    },
  ]);

  return render(<RemixStub />);
};

describe("RadioGroup", () => {
  beforeEach(() => {
    vi.mocked(useStringField).mockReturnValue(createUseStringFieldMock());
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
    vi.mocked(useStringField).mockReturnValue(
      createUseStringFieldMock("required"),
    );
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
    vi.mocked(useStringField).mockReturnValue(
      createUseStringFieldMock("required"),
    );
    renderRadioGroup();
    const fieldset = screen.getByRole("group");
    expect(fieldset).toHaveAttribute("aria-invalid", "true");
  });
});
