import { render, screen } from "@testing-library/react";
import { FileUploadState } from "~/services/fileUploadState/fileUploadState";
import { FileUploadError, FileUploadErrorType } from "../FileUploadError";

describe("FileUploadError", () => {
  it("renders the correct error message when no file is uploaded", () => {
    const mockFile = new File([""], "testfile1.pdf", {
      type: "application/pdf",
    });
    render(
      <FileUploadError
        file={mockFile}
        state={FileUploadState.NotStarted}
        fileSize={0}
        fileExtension={"application/pdf"}
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
      type: "application/pdf",
    });
    render(
      <FileUploadError
        file={mockFile}
        state={FileUploadState.NotStarted}
        fileSize={0}
        fileExtension={"application/pdf"}
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
    render(
      <FileUploadError
        file={mockFile}
        state={FileUploadState.NotStarted}
        fileSize={200}
        fileExtension={"application/pdf"}
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
