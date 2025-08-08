import { render, screen } from "@testing-library/react";
import Radio from "../Radio";

const getErrorMock = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn((props) => ({ ...props })),
    error: getErrorMock,
  }),
}));

const mockError = (error: string) => {
  getErrorMock.mockReturnValue(error);
};

const defaultProps = {
  name: "testRadio",
  value: "yes",
  text: "Yes",
  ref: { current: null },
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe("Radio", () => {
  it("renders correctly with label and value", () => {
    render(<Radio {...defaultProps} />);
    const radio = screen.getByLabelText("Yes");
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute("value", "yes");
  });

  it("calls onClick when clicked", () => {
    const onClickMock = vi.fn();
    render(<Radio {...defaultProps} onClick={onClickMock} />);
    const radio = screen.getByLabelText("Yes");
    radio.click();
    expect(onClickMock).toHaveBeenCalled();
  });

  it("sets aria-describedby when error is present", () => {
    mockError("This field has an error");

    render(<Radio {...defaultProps} />);
    const radio = screen.getByLabelText("Yes");
    expect(radio).toHaveAttribute("aria-describedby", "testRadio-error");
  });
});
