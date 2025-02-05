import { render, screen } from "@testing-library/react";
import { FileUploadButton } from "../FileUploadButton";

describe("FileUploadButton", () => {
  it("renders a button to upload a file", () => {
    render(<FileUploadButton files={null} setFiles={() => null} />);
    const fileUploadButton = screen.getByRole("button", {
      name: "Datei auswählen",
    });
    expect(fileUploadButton).toBeInTheDocument();
    expect(fileUploadButton).toHaveClass("ds-button-tertiary");
  });

  it("renders a button to upload more files", () => {
    const mockFilesArray = [
      new File([""], "testfile0.pdf", {
        type: "application/pdf",
      }),
    ];

    const mockFiles = {
      item: (index: number) => mockFilesArray[index] || null,
      ...mockFilesArray,
    } as FileList;

    render(
      <FileUploadButton files={mockFiles} setFiles={() => mockFilesArray} />,
    );
    const addMoreFileUploadButton = screen.getByRole("button", {
      name: "Weitere Dokumente hinzufügen",
    });
    expect(addMoreFileUploadButton).toBeInTheDocument();
    expect(addMoreFileUploadButton).toHaveClass("ds-button-tertiary");
    const addIcon = screen.getByTestId("AddIcon");
    expect(addIcon).toBeInTheDocument();
    expect(addIcon).toHaveClass("w-6 h-6");
  });
});
