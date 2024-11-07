import { createRemixStub } from "@remix-run/testing";
import { render } from "@testing-library/react";
import * as remixValidatedForm from "remix-validated-form";
import TileGroup from "~/components/inputs/tile/TileGroup";

vi.mock("remix-validated-form", () => ({
  useField: vi.fn(),
}));

const COMPONENT_NAME = "TileGroup";
const COMPONENT_TILE_RADIO_TEXT = "TileRadio";
const COMPONENT_TILE_TEXT = "TileGroup";

vi.mock("~/components/inputs/tile/TileRadio", () => ({
  default: () => <div>{COMPONENT_TILE_RADIO_TEXT}</div>,
}));

describe("TileGroup", () => {
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
