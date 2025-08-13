import { render } from "@testing-library/react";
import TileTag from "~/components/formElements/tile/TileTag";

describe("TileTag", () => {
  describe("when props are passed", () => {
    it("should render properly", () => {
      const mockTagDescription = "value";

      const { queryByText } = render(
        <TileTag tagDescription={mockTagDescription} />,
      );

      expect(queryByText(mockTagDescription)).toBeInTheDocument();
    });
  });

  describe("when no props are passed", () => {
    it("should render properly", () => {
      const { container } = render(<TileTag />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});
