import { render, screen } from "@testing-library/react";
import { SingleFileUpload, SingleFileUploadState } from "../SingleFileUpload";

describe("SingleFileUpload", () => {
  const mockedFile = new File([""], "testfile0.pdf", {
    type: "application/pdf",
  });
  it("renders correctly inProgress component", () => {
    render(
      <SingleFileUpload
        file={mockedFile}
        uploadProgressLabel={"loading..."}
        cancelButtonLabel={"Cancel"}
        deleteButtonLabel={""}
        uploadFileState={SingleFileUploadState.InProgress}
      />,
    );
    const fileName = screen.getByText("testfile0.pdf");
    expect(fileName).toBeInTheDocument();
    const progressLabel = screen.getByText("loading...");
    expect(progressLabel).toBeInTheDocument();
    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toBeInTheDocument();
  });
  it("renders correctly Done component", () => {
    render(
      <SingleFileUpload
        file={mockedFile}
        uploadProgressLabel={""}
        cancelButtonLabel={""}
        deleteButtonLabel={"Delete"}
        uploadFileState={SingleFileUploadState.Done}
      />,
    );
    const fileName = screen.getByText("testfile0.pdf");
    expect(fileName).toBeInTheDocument();
    const fileSize = screen.getByText("0 MB");
    expect(fileSize).toBeInTheDocument();
    const deleteButton = screen.getByText("Delete");
    expect(deleteButton).toBeInTheDocument();
  });
});
