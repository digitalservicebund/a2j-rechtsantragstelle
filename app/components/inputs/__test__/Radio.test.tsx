import { render, screen } from "@testing-library/react";
import Radio from "../Radio";

const getErrorMock = vi.fn();

vi.mock("@rvf/remix", () => ({
  useField: () => ({
    getInputProps: vi.fn((props) => ({ ...props })),
    error: getErrorMock,
  }),
}));

const mockError = (error: string) => {
  getErrorMock.mockReturnValue(error);
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Radio", () => {
  it("renders correctly with label and value", () => {
    render(<Radio name="testRadio" value="yes" text="Yes" />);
    const radio = screen.getByLabelText("Yes");
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute("value", "yes");
  });

  it("calls onClick when clicked", () => {
    const onClickMock = vi.fn();
    render(
      <Radio name="testRadio" value="yes" text="Yes" onClick={onClickMock} />,
    );
    const radio = screen.getByLabelText("Yes");
    radio.click();
    expect(onClickMock).toHaveBeenCalled();
  });

  it("sets aria-describedby when error is present", () => {
    mockError("This field has an error");

    render(<Radio name="testRadio" value="yes" text="Yes" />);
    const radio = screen.getByLabelText("Yes");
    expect(radio).toHaveAttribute("aria-describedby", "testRadio-error");
  });
});
