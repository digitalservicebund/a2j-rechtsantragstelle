import { render, screen } from "@testing-library/react";
import { FileUploadInProgress } from "../FileUploadInProgress";

describe("FileUploadInProgress", () => {
  it("renders correctly a spinner, the file name and the progress text", () => {
    render(
      <FileUploadInProgress
        fileName={"testfile1.pdf"}
        uploadProgressLabel={"loading..."}
        cancelButtonLabel={"Cancel"}
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
      <FileUploadInProgress
        fileName={"testfile1.pdf"}
        uploadProgressLabel={"loading..."}
        cancelButtonLabel={"Cancel"}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveClass(
      "ds-button ds-button-ghost ds-button-with-icon",
    );
  });
});
