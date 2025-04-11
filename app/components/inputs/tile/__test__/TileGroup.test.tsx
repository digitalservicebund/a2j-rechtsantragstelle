import { render } from "@testing-library/react";
import TileGroup from "~/components/inputs/tile/TileGroup";

vi.mock("@rvf/remix", () => ({
  useField: () => ({
    getInputProps: vi.fn().mockReturnValue({
      id: COMPONENT_NAME,
      placeholder: "Test Placeholder",
    }),
    error: vi.fn(),
    defaultValue: vi.fn(),
  }),
}));

const COMPONENT_NAME = "TileGroup";
const COMPONENT_TILE_RADIO_TEXT = "TileRadio";
const COMPONENT_TILE_TEXT = "TileGroup";

vi.mock("~/components/inputs/tile/TileRadio", () => ({
  default: () => <div>{COMPONENT_TILE_RADIO_TEXT}</div>,
}));

describe("TileGroup", () => {
  it("should render the component TileRadio", () => {
    const { queryByText } = render(
      <TileGroup name={COMPONENT_NAME} options={[{ value: "value" }]} />,
    );

    expect(queryByText(COMPONENT_TILE_RADIO_TEXT)).toBeInTheDocument();
    expect(queryByText(COMPONENT_TILE_TEXT)).not.toBeInTheDocument();
  });
});
