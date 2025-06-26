import { fireEvent, render } from "@testing-library/react";
import { FileUploadInfo } from "~/components/filesUpload/FileUploadInfo";
import {
  errorStyling,
  type PDFFileMetadata,
} from "~/services/validation/pdfFileSchema";

const fileName = "testfile1.pdf";
const inputName = "belege[0]";
const fileSize = 3145728;
const mockFile: PDFFileMetadata = {
  filename: fileName,
  fileSize: fileSize,
  fileType: "application/pdf",
};

describe("FileUploadInfo", () => {
  it("renders an icon, file name and size", () => {
    const { getByText, getByTestId } = render(
      <FileUploadInfo
        jsAvailable={true}
        onFileDelete={vi.fn()}
        inputName={inputName}
        file={mockFile}
      />,
    );
    const fileNameLabel = getByText("testfile1.pdf");
    const fileIcon = getByTestId("InsertDriveFileIcon");
    expect(fileNameLabel).toBeInTheDocument();
    expect(fileIcon).toBeInTheDocument();
    expect(getByText("Löschen")).toBeInTheDocument();
    expect(getByTestId("DeleteOutlineIcon")).toBeInTheDocument();
    expect(getByText("3 MB")).toBeInTheDocument();
  });

  it("renders the correct error styling", () => {
    const { getByTestId } = render(
      <FileUploadInfo
        jsAvailable={true}
        onFileDelete={vi.fn()}
        inputName={inputName}
        file={mockFile}
        hasError={true}
      />,
    );
    const parentDiv = getByTestId(`file-upload-info-belege[0]`);
    expect(parentDiv).toHaveClass(errorStyling);
  });

  describe("Delete Button", () => {
    it("works with JS enabled", () => {
      const onFileDelete = vi.fn();
      const { getByRole } = render(
        <FileUploadInfo
          jsAvailable={true}
          onFileDelete={onFileDelete}
          inputName={inputName}
          file={mockFile}
        />,
      );
      const deleteButton = getByRole("button");
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute("type", "button");
      fireEvent.click(deleteButton);
      expect(onFileDelete).toHaveBeenCalled();
    });

    it("works without JS enabled", () => {
      const onFileDelete = vi.fn();
      const { getByRole } = render(
        <FileUploadInfo
          jsAvailable={false}
          onFileDelete={onFileDelete}
          inputName={inputName}
          file={mockFile}
        />,
      );
      const deleteButton = getByRole("button");
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute("type", "submit");
      fireEvent.click(deleteButton);
      expect(onFileDelete).not.toHaveBeenCalled();
    });
  });
});
