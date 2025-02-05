import { render, screen } from "@testing-library/react";
import { FileUploadError, FileUploadErrorType } from "../FileUploadError";

describe("FileUploadError", () => {
  it("renders the correct error message when upload is not started", () => {
    render(
      <FileUploadError errorMessage={FileUploadErrorType.NoFileUploaded} />,
    );
    const errorIcon = screen.getByTestId("ErrorOutlineIcon");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass("shrink-0 fill-red-900 mr-10");
    const errorMessage = screen.getByText("Bitte wählen Sie eine Datei aus.");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-900 text-base");
  });
  it("renders the correct error message when invalid file extension is uploaded", () => {
    render(
      <FileUploadError
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
    render(
      <FileUploadError errorMessage={FileUploadErrorType.InvalidFileSize} />,
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
