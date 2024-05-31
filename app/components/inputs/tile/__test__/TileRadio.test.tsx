import { createRemixStub } from "@remix-run/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import TileRadio from "~/components/inputs/tile/TileRadio";

const COMPONENT_NAME = "TileRadio";

jest.mock("remix-validated-form", () => ({
  useField: jest.fn(),
}));

describe("TileRadio", () => {
  beforeEach(() => {
    jest.spyOn(remixValidatedForm, "useField").mockReturnValue({
      getInputProps: jest.fn().mockReturnValue({
        id: COMPONENT_NAME,
        placeholder: "Test Placeholder",
      }),
      clearError: jest.fn(),
      validate: jest.fn(),
      touched: false,
      setTouched: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("check if the componenet renders correct", () => {
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <TileRadio
            name={COMPONENT_NAME}
            value="any value"
            onClick={jest.fn()}
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
    const handleClick = jest.fn();
    const RemixStub = createRemixStub([
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
