import { render, screen } from "@testing-library/react";
import { FileUploadState } from "~/services/fileUploadState/fileUploadState";
import FileUpload from "../FileUpload";

describe("FileUpload", () => {
  it("renders a file upload element", () => {
    render(
      <FileUpload
        isDisabled={false}
        fileName={"testFile.pdf"}
        fileExtension={"application/pdf"}
        fileSize={0}
        state={FileUploadState.NotStarted}
      />,
    );

    const fileUpload = screen.getByRole("button", { name: "Datei auswählen" });
    expect(fileUpload).toBeInTheDocument();
  });
});
