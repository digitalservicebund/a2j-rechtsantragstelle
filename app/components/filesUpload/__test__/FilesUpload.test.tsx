import { render, screen } from "@testing-library/react";
import { FilesUpload } from "../FilesUpload";

describe.skip("FileUpload", () => {
  it("renders the beleg title and description", () => {
    render(<FilesUpload />);

    const belegTitle = "A beleg title";
    const belegeDescription = "A beleg description";

    expect(screen.getByText(belegTitle)).toBeInTheDocument();
    expect(screen.getByText(belegeDescription)).toBeInTheDocument();
    expect(belegTitle).toHaveClass("text-base text-900 font-black");
    expect(belegeDescription).toHaveClass("text-base text-gray-800 text-400");
  });
});
