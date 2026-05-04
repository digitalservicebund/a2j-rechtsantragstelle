import { render, screen } from "@testing-library/react";
import TileContent from "../TileContent";

describe("TileContent", () => {
  it("should render title and description", () => {
    render(<TileContent title="Title" description="Description" />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("should render image when provided", () => {
    const { container } = render(<TileContent image={{ url: "/test.png" }} />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });
});
