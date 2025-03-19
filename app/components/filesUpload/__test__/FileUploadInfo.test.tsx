import { fireEvent, render } from "@testing-library/react";
import { FileUploadInfo } from "~/components/filesUpload/FileUploadInfo";
import { PDFFileMetadata } from "~/util/file/pdfFileSchema";

const deleteButtonLabel = "Delete";
const fileName = "testfile1.pdf";
const inputName = "belege[0]";
const fileSize = 3145728;
const mockFile: PDFFileMetadata = {
  filename: fileName,
  fileSize: fileSize,
  fileType: "application/pdf",
  createdOn: new Date().toString(),
};

describe("FileUploadInfo", () => {
  it("renders an icon, file name and size", () => {
    const { getByText, getByTestId } = render(
      <FileUploadInfo
        jsAvailable={true}
        onFileDelete={vi.fn()}
        inputName={inputName}
        file={mockFile}
        deleteButtonLabel={deleteButtonLabel}
      />,
    );
    const fileNameLabel = getByText("testfile1.pdf");
    const fileIcon = getByTestId("InsertDriveFileIcon");
    expect(fileNameLabel).toBeInTheDocument();
    expect(fileNameLabel).toHaveClass(
      "ds-body-01-reg text-black mr-8 ml-10 truncate",
    );
    expect(fileIcon).toBeInTheDocument();
    expect(fileIcon).toHaveClass("shrink-0 fill-gray-900");
    expect(getByText(deleteButtonLabel)).toBeInTheDocument();
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
        deleteButtonLabel={deleteButtonLabel}
        hasError={true}
      />,
    );
    const parentDiv = getByTestId(`file-upload-info-belege[0]`);
    expect(parentDiv).toHaveClass("bg-red-200 border border-red-900");
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
          deleteButtonLabel={deleteButtonLabel}
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
          deleteButtonLabel={deleteButtonLabel}
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
