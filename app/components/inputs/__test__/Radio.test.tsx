import { render, screen } from "@testing-library/react";
import { useField } from "remix-validated-form";
import Radio from "../Radio";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

const createUseFieldMock = (error?: string) => ({
  error,
  defaultValue: undefined,
  clearError: vi.fn(),
  validate: vi.fn(),
  touched: false,
  setTouched: vi.fn(),
  getInputProps: vi.fn((props) => ({ ...props })),
});

describe("Radio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useField).mockReturnValue(createUseFieldMock());
  });

  it("renders correctly with label and value", () => {
    render(<Radio name="testRadio" value="yes" text="Yes" formId="form-1" />);
    const radio = screen.getByLabelText("Yes");
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute("value", "yes");
  });

  it("calls onClick when clicked", () => {
    const onClickMock = vi.fn();
    render(
      <Radio
        name="testRadio"
        value="yes"
        text="Yes"
        formId="form-1"
        onClick={onClickMock}
      />,
    );
    const radio = screen.getByLabelText("Yes");
    radio.click();
    expect(onClickMock).toHaveBeenCalled();
  });

  it("sets aria-describedby when error is present", () => {
    vi.mocked(useField).mockReturnValue(
      createUseFieldMock("This field has an error"),
    );

    render(<Radio name="testRadio" value="yes" text="Yes" formId="form-1" />);
    const radio = screen.getByLabelText("Yes");
    expect(radio).toHaveAttribute("aria-describedby", "testRadio-error");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(
      <Radio
        name="testRadio"
        value="yes"
        text="Yes"
        formId="form-1"
        ref={ref}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
