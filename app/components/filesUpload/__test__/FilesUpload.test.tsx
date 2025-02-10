import { render, screen } from "@testing-library/react";
import { FilesUpload } from "../FilesUpload";

describe.skip("FileUpload", () => {
  it("renders the beleg title and description", () => {
    render(
      <FilesUpload
        fileNames={[]}
        fileSizes={[]}
        cancelButtonLabel={""}
        deleteButtonLabel={""}
        uploadProgressLabel={""}
      />,
    );

    const belegTitle = "A beleg title";
    const belegeDescription = "A beleg description";

    expect(screen.getByText(belegTitle)).toBeInTheDocument();
    expect(screen.getByText(belegeDescription)).toBeInTheDocument();
    expect(belegTitle).toHaveClass("text-base text-900 font-black");
    expect(belegeDescription).toHaveClass("text-base text-gray-800 text-400");
  });

  it("renders a button to upload more files", () => {
    render(
      <FilesUpload
        fileNames={[]}
        fileSizes={[]}
        cancelButtonLabel={""}
        deleteButtonLabel={""}
        uploadProgressLabel={""}
      />,
    );

    const addMoreFilesUploadButton = screen.getByRole("button", {
      name: "Weitere Dokumente hinzufügen",
    });
    expect(addMoreFilesUploadButton).toBeInTheDocument();
    expect(addMoreFilesUploadButton).toHaveClass("ds-button-tertiary");
    const addIcon = screen.getByTestId("AddIcon");
    expect(addIcon).toBeInTheDocument();
    expect(addIcon).toHaveClass("w-6 h-6");
  });

  it("renders the file name, file size and a delete file button when the upload was successful", () => {
    const mockFile = new File([""], "testfile.pdf", {
      type: "application/pdf",
    });

    const oneMegaByteInBytes = 1024 * 1024;

    Object.defineProperty(mockFile, "size", {
      value: oneMegaByteInBytes,
    });

    render(
      <FilesUpload
        fileNames={[]}
        fileSizes={[]}
        cancelButtonLabel={""}
        deleteButtonLabel={""}
        uploadProgressLabel={""}
      />,
    );

    const fileIcon = screen.getByTestId("InsertDriveFileIcon");
    expect(fileIcon).toBeInTheDocument();
    expect(fileIcon).toHaveClass("shrink-0 fill-gray-900 mr-10");

    const fileName = screen.getByText(mockFile.name);
    expect(fileName).toBeInTheDocument();
    expect(fileName).toHaveClass(
      "w-full max-w-md text-base text-black font-400 mr-8 overflow-hidden whitespace-nowrap text-ellipsis",
    );

    const fileSize = screen.getByText("1 MB");
    expect(fileSize).toBeInTheDocument();
    expect(fileSize).toHaveClass(
      "w-full max-w-24 text-base text-gray-900 font-400",
    );

    const deleteButton = screen.getByRole("button", {
      name: "Entfernen",
    });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("ds-button-ghost");
    const deleteIcon = screen.getByTestId("DeleteOutlineIcon");
    expect(deleteIcon).toBeInTheDocument();
    expect(deleteIcon).toHaveClass("shrink-0");
  });

  it("renders the file name and a loading text when the upload is in progress", () => {
    const mockFile = new File([""], "testfile.pdf", {
      type: "application/pdf",
    });
    render(
      <FilesUpload
        fileNames={[]}
        fileSizes={[]}
        cancelButtonLabel={""}
        deleteButtonLabel={""}
        uploadProgressLabel={""}
      />,
    );

    // Make an assertion for the loader here

    const fileName = screen.getByText(mockFile.name);
    expect(fileName).toBeInTheDocument();
    expect(fileName).toHaveClass(
      "w-full max-w-md text-base text-black font-400 mr-8 overflow-hidden whitespace-nowrap text-ellipsis",
    );

    const loadingText = screen.getByText("wird hochgeladen...");
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toHaveClass(
      "w-full max-w-24 text-base text-gray-900 font-400",
    );

    const cancelButton = screen.getByRole("button", {
      name: "Abbrechen",
    });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveClass("ds-button-ghost");
    const cancelIcon = screen.getByTestId("CloseIcon");
    expect(cancelIcon).toBeInTheDocument();
    expect(cancelIcon).toHaveClass("shrink-0");
  });
  // Make assertion for deleting a file
  // Make assertion for canceling an upload
  // Make an assertion for limit of files
});
