import { render, screen } from "@testing-library/react";
import { FileUpload } from "../FileUpload";

describe("FileUpload", () => {
  it("renders a file upload element", () => {
    render(<FileUpload />);
    const fileUpload = screen.getByRole("button", { name: "Datei auswählen" });
    expect(fileUpload).toBeInTheDocument();
  });

  it.skip("renders the correct error message when invalid file size is uploaded", () => {
    const mockFile = new File([""], "testfile3.pdf", {
      type: "application/pdf",
    });
    // This defines a property size to the mockFile and sets the value to 200MB
    const fileSizeMegabytesToBytes = 209715200;
    Object.defineProperty(mockFile, "size", {
      value: fileSizeMegabytesToBytes,
    });
  });
});
