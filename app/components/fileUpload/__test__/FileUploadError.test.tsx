import { render, screen } from "@testing-library/react";
import { FileUploadError, FileUploadErrorType } from "../FileUploadError";

describe("FileUploadError", () => {
  it("renders the correct error message when upload is not started", () => {
    const mockFile = new File([""], "testfile2.pdf", {
      type: "application/docx",
    });
    render(
      <FileUploadError
        file={mockFile}
        errorMessage={FileUploadErrorType.NoFileUploaded}
      />,
    );
    const errorIcon = screen.getByTestId("ErrorOutlineIcon");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass("shrink-0 fill-red-900 mr-10");
    const errorMessage = screen.getByText("Bitte wählen Sie eine Datei aus.");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-900 text-base");
  });
  it("renders the correct error message when invalid file extension is uploaded", () => {
    const mockFile = new File([""], "testfile2.pdf", {
      type: "application/docx",
    });
    render(
      <FileUploadError
        file={mockFile}
        errorMessage={FileUploadErrorType.InvalidFileExtension}
      />,
    );

    const errorIcon = screen.getByTestId("ErrorOutlineIcon");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass("shrink-0 fill-red-900 mr-10");
    const errorMessage = screen.getByText(
      "Bitte laden Sie nur PDF– oder TIF–Dateien hoch.",
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-900 text-base");
  });
  it("renders the correct error message when invalid file size is uploaded", () => {
    const mockFile = new File([""], "testfile3.pdf", {
      type: "application/pdf",
    });
    // This defines a property size to the mockFile and sets the value to 200MB
    const fileSizeMegabytesToBytes = 209715200;
    Object.defineProperty(mockFile, "size", {
      value: fileSizeMegabytesToBytes,
    });

    render(
      <FileUploadError
        file={mockFile}
        errorMessage={FileUploadErrorType.InvalidFileSize}
      />,
    );

    const errorIcon = screen.getByTestId("ErrorOutlineIcon");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass("shrink-0 fill-red-900 mr-10");
    const errorMessage = screen.getByText(
      "Bitte laden Sie nur Dateien mit einer maximalen Größe von jeweils 100 MB hoch.",
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-900 text-base");
  });
});
