import { fireEvent, render, screen } from "@testing-library/react";
import TileRadio from "~/components/inputs/tile/TileRadio";

const COMPONENT_NAME = "TileRadio";

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn().mockReturnValue({
      id: COMPONENT_NAME,
      placeholder: "Test Placeholder",
    }),
    error: vi.fn(),
    defaultValue: vi.fn(),
  }),
}));

describe("TileRadio", () => {
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
});
