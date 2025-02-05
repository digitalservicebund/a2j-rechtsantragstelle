import { render, screen } from "@testing-library/react";
import { FileUpload } from "../FileUpload";

describe("FileUpload", () => {
  it("renders a file upload element", () => {
    render(<FileUpload />);
    const fileUpload = screen.getByRole("button", { name: "Datei auswählen" });
    expect(fileUpload).toBeInTheDocument();
  });
});
