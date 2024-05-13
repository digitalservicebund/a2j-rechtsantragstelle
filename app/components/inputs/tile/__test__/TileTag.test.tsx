import { render } from "@testing-library/react";
import TileTag from "~/components/inputs/tile/TileTag";

describe("TileTag", () => {
  it("it should render the component, in case enter a value in the props", () => {
    const mockTagDescription = "value";

    const { queryByText } = render(
      <TileTag tagDescription={mockTagDescription} />,
    );

    expect(queryByText(mockTagDescription)).toBeInTheDocument();
  });

  it("it should not render the component, in case it does not enter a value in the props", () => {
    const { container } = render(<TileTag />);

    expect(container).toBeEmptyDOMElement();
  });
});
