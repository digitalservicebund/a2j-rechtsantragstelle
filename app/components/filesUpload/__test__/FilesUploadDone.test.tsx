import { render, screen } from "@testing-library/react";
import { FilesUploadDone } from "../FilesUploadDone";

describe("FilesUploadDone", () => {
  it("renders an icon, file name and size", () => {
    render(
      <FilesUploadDone
        fileName={"testfile1.pdf"}
        fileSize={3145728}
        deleteButtonLabel={"Delete"}
        selectMoreFilesButtonLabel={"Add more files"}
      />,
    );
    const fileNames = screen.getByText("testfile1.pdf");
    const fileIcon = screen.getByTestId("InsertDriveFileIcon");
    expect(fileNames).toBeInTheDocument();
    expect(fileNames).toHaveClass(
      "text-base text-black font-400 mr-8 ml-10 truncate",
    );
    expect(fileIcon).toBeInTheDocument();
    expect(fileIcon).toHaveClass("shrink-0 fill-gray-900");
  });
  it("renders a delete button", () => {
    render(
      <FilesUploadDone
        fileName={"testfile1.pdf"}
        fileSize={3145728}
        deleteButtonLabel={"Delete"}
        selectMoreFilesButtonLabel={""}
      />,
    );
    const deleteButton = screen.getByRole("button", {
      name: "Delete",
    });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass(
      "ds-button ds-button-ghost ds-button-with-icon",
    );
  });

  it("renders an add more files button", () => {
    render(
      <FilesUploadDone
        fileName={"testfile1.pdf"}
        fileSize={3145728}
        deleteButtonLabel={""}
        selectMoreFilesButtonLabel={"Add more files"}
      />,
    );
    const addMoreFilesButton = screen.getByRole("button", {
      name: "Add more files",
    });
    expect(addMoreFilesButton).toBeInTheDocument();
    expect(addMoreFilesButton).toHaveClass("ds-button ds-button-with-icon");
  });
});
