import { render, screen } from "@testing-library/react";
import { FilesUploadHeader } from "../FilesUploadHeader";

describe("FilesUploadHeader", () => {
  it("renders correctly title and description", () => {
    render(<FilesUploadHeader title={"Title"} description={"Description"} />);
    const title = screen.getByText("Title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-base text-900 font-black");
    const description = screen.getByText("Description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-base text-gray-800 text-400");
  });
});
