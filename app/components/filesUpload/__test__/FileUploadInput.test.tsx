import { render, screen } from "@testing-library/react";
import { FileUploadInput } from "../FileUploadInput";

describe("FileUploadInput", () => {
  it("renders an upload files input", () => {
    render(
      <FileUploadInput
        inputName={""}
        selectFilesButtonLabel={""}
        onFileSelect={vi.fn()}
      />,
    );
    const fileUploadInput = screen.getByTestId("fileUploadInput");
    expect(fileUploadInput).toBeInTheDocument();
    expect(fileUploadInput).toHaveClass(
      "ds-input w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer",
    );
    expect(fileUploadInput).toHaveAttribute("type", "file");
    expect(fileUploadInput).toHaveAttribute("accept", ".pdf, .tiff, .tif");
  });
  it("renders an upload files button", () => {
    render(
      <FileUploadInput
        inputName={""}
        selectFilesButtonLabel={"Select File"}
        onFileSelect={vi.fn()}
      />,
    );
    const filesUploadButton = screen.getByRole("button", {
      name: "Select File",
    });
    expect(filesUploadButton).toBeInTheDocument();
    expect(filesUploadButton).toHaveClass("ds-button-tertiary");
  });
});
