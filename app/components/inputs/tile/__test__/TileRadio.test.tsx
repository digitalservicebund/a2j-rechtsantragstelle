import { fireEvent, render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import * as remixValidatedForm from "remix-validated-form";
import TileRadio from "~/components/inputs/tile/TileRadio";

const COMPONENT_NAME = "TileRadio";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

describe("TileRadio", () => {
  beforeEach(() => {
    vi.spyOn(remixValidatedForm, "useField").mockReturnValue({
      getInputProps: vi.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: "Test Placeholder",
      }),
      clearError: vi.fn(),
      validate: vi.fn(),
      touched: false,
      setTouched: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("check if the componenet renders correct", () => {
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <TileRadio
            name={COMPONENT_NAME}
            value="any value"
            onClick={vi.fn()}
          />
        ),
      },
    ]);

    const { container, queryByRole } = render(<RemixStub />);

    expect(container.getElementsByClassName("ds-tile-radio-group").length).toBe(
      1,
    );
    expect(queryByRole("radio")).toBeInTheDocument();
  });

  it("check if the click works", () => {
    const handleClick = vi.fn();
    const RemixStub = createRoutesStub([
      {
        path: "",
        Component: () => (
          <TileRadio
            name={COMPONENT_NAME}
            value="any value"
            onClick={handleClick}
          />
        ),
      },
    ]);

    render(<RemixStub />);
    fireEvent.click(screen.getByRole("radio"));

    expect(handleClick).toHaveBeenCalled();
  });
});
