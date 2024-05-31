import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import TileGroup from "~/components/inputs/tile/TileGroup";

jest.mock("remix-validated-form", () => ({
  useField: jest.fn(),
}));

const COMPONENT_NAME = "TileGroup";
const COMPONENT_TILE_RADIO_TEXT = "TileRadio";
const COMPONENT_TILE_TEXT = "TileGroup";

// eslint-disable-next-line react/display-name
jest.mock("~/components/inputs/tile/TileRadio", () => () => (
  <div>{COMPONENT_TILE_RADIO_TEXT}</div>
));

describe("TileGroup", () => {
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

  it("should render the component TileRadio", () => {
    const RemixStub = createRemixStub([
      {
        path: "",
        Component: () => (
          <TileGroup name={COMPONENT_NAME} options={[{ value: "value" }]} />
        ),
      },
    ]);

    const { queryByText } = render(<RemixStub />);

    expect(queryByText(COMPONENT_TILE_RADIO_TEXT)).toBeInTheDocument();
    expect(queryByText(COMPONENT_TILE_TEXT)).not.toBeInTheDocument();
  });
});
