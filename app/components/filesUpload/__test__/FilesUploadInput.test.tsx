import { render, screen } from "@testing-library/react";
import { FilesUploadInput } from "../FilesUploadInput";

describe("FilesUploadInput", () => {
  it("renders an upload files input", () => {
    render(<FilesUploadInput fieldName={""} selectFilesButtonLabel={""} />);
    const filesUploadInput = screen.getByTestId("filesUpload");
    expect(filesUploadInput).toBeInTheDocument();
    expect(filesUploadInput).toHaveClass(
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer",
    );
    expect(filesUploadInput).toHaveAttribute("type", "file");
    expect(filesUploadInput).toHaveAttribute("accept", ".pdf, .tiff, .tif");
  });
  it("renders an upload files button", () => {
    render(
      <FilesUploadInput
        fieldName={""}
        selectFilesButtonLabel={"Select File"}
      />,
    );
    const filesUploadButton = screen.getByRole("button", {
      name: "Select File",
    });
    expect(filesUploadButton).toBeInTheDocument();
    expect(filesUploadButton).toHaveClass("ds-button-tertiary");
  });
});
