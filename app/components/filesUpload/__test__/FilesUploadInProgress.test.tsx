import { render, screen } from "@testing-library/react";
import { FilesUploadInProgress } from "../FilesUploadInProgress";

describe("FilesUploadInProgress", () => {
  it("renders correctly a spinner, the file name and the progress text", () => {
    render(
      <FilesUploadInProgress
        fileNames={["testfile1.pdf"]}
        uploadProgressLabel={"loading..."}
        cancelButtonLabel={"Cancel"}
        selectMoreFilesButtonLabel={"Add More Files"}
      />,
    );

    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-24 w-24 animate-spin");

    const fileNames = screen.getByText("testfile1.pdf");
    expect(fileNames).toBeInTheDocument();
    expect(fileNames).toHaveClass(
      "max-w-2xs text-base text-black font-400 mr-8 ml-10 truncate",
    );

    const progressText = screen.getByText("loading...");
    expect(progressText).toBeInTheDocument();
    expect(progressText).toHaveClass(
      "max-w-32 text-base text-gray-900 font-400",
    );
  });
  it("renders correctly a cancel button", () => {
    render(
      <FilesUploadInProgress
        fileNames={["testfile1.pdf"]}
        uploadProgressLabel={"loading..."}
        cancelButtonLabel={"Cancel"}
        selectMoreFilesButtonLabel={"Add More Files"}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveClass(
      "ds-button ds-button-ghost ds-button-with-icon",
    );
  });
  it("renders correctly a add more files button", () => {
    render(
      <FilesUploadInProgress
        fileNames={["testfile1.pdf"]}
        uploadProgressLabel={"loading..."}
        cancelButtonLabel={"Cancel"}
        selectMoreFilesButtonLabel={"Add More Files"}
      />,
    );

    const addMoreFilesButton = screen.getByRole("button", {
      name: "Add More Files",
    });
    expect(addMoreFilesButton).toBeInTheDocument();
    expect(addMoreFilesButton).toHaveClass("ds-button ds-button-with-icon");
  });
});
