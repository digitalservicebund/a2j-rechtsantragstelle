import { fireEvent, render, screen } from "@testing-library/react";
import TileRadio from "~/components/inputs/tile/TileRadio";

const COMPONENT_NAME = "TileRadio";

const mockError = "error-message";

const mockProps = {
  name: COMPONENT_NAME,
  value: "any value",
  onClick: vi.fn(),
  title: "Test Title",
  description: "Test Description",
  tagDescription: "New",
  image: {
    url: "test.jpg",
    alternativeText: "test image",
    width: 32,
    height: 32,
  },
};

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn((props) => ({ ...props })),
    error: vi.fn().mockReturnValue(mockError),
    defaultValue: vi.fn(),
    refs: {
      controlled: vi.fn(),
    },
  }),
}));

describe("TileRadio", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("check if the component renders correct", () => {
    const { container, queryByRole } = render(
      <TileRadio name={COMPONENT_NAME} value="any value" onClick={vi.fn()} />,
    );

    expect(container.getElementsByClassName("ds-tile-radio-group").length).toBe(
      1,
    );
    expect(queryByRole("radio")).toBeInTheDocument();
  });

  it("check if the click works", () => {
    const handleClick = vi.fn();

    render(
      <TileRadio
        name={COMPONENT_NAME}
        value="any value"
        onClick={handleClick}
      />,
    );
    fireEvent.click(screen.getByRole("radio"));

    expect(handleClick).toHaveBeenCalled();
  });

  it("forwards ref to input element", () => {
    const ref = { current: null };

    render(
      <TileRadio
        name={COMPONENT_NAME}
        value="any value"
        onClick={vi.fn()}
        ref={ref}
      />,
    );

    const input = screen.getByRole("radio");
    expect(ref.current).toBe(input);
  });

  it("sets proper aria attributes when there is an error", () => {
    render(<TileRadio {...mockProps} />);

    const radio = screen.getByRole("radio");
    expect(radio).toHaveAttribute(
      "aria-describedby",
      `${COMPONENT_NAME}-error`,
    );
  });
});
