import { render, screen } from "@testing-library/react";
import { FilesUpload } from "../FilesUpload";

describe("FileUpload", () => {
  it("renders a file upload element", () => {
    render(<FilesUpload />);
    const fileUpload = screen.getByRole("button", { name: "Datei auswählen" });
    expect(fileUpload).toBeInTheDocument();
  });
});
