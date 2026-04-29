import { render, screen } from "@testing-library/react";
import KernTileContent from "../KernTileContent";

describe("TileContent", () => {
  it("should render title and description", () => {
    render(<KernTileContent tileTitle="Title" tileDescription="Description" />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("should render image when provided", () => {
    const { container } = render(
      <KernTileContent image={{ url: "/test.png" }} />,
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });
});
