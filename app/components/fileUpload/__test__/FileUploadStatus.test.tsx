import { render, screen } from "@testing-library/react";
import { FileUploadState } from "~/services/fileUploadState/fileUploadState";
import { FileUploadStatus } from "../FileUploadStatus";

describe("FileUploadInProgress", () => {
  it("renders the file name and a checkIcon when the upload was successful", () => {
    const mockFile = new File([""], "testfile.pdf", {
      type: "application/pdf",
    });
    render(<FileUploadStatus file={mockFile} state={FileUploadState.Done} />);
    screen.debug();

    const fileName = screen.getByText(mockFile.name);
    expect(fileName).toBeInTheDocument();
    const checkIcon = screen.getByTestId("CheckIcon");
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveClass("shrink-0 fill-green-700");
  });

  it("renders the file name and a loading text when the upload is in progress", async () => {
    const mockFile = new File([""], "testfile.pdf", {
      type: "application/pdf",
    });
    render(
      <FileUploadStatus file={mockFile} state={FileUploadState.InProgress} />,
    );
    // Make an assertion for the loader here
    screen.debug();
    // Revisit this assertion
    const fileNameAndLoadingText = await screen.findByText(
      /testfile.pdf.*wird hochgeladen.../,
    );
    expect(fileNameAndLoadingText).toBeInTheDocument();
  });
});
