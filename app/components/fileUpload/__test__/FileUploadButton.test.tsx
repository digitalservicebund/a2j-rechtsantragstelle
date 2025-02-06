import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUploadButton } from "../FileUploadButton";

describe("FileUploadButton", () => {
  it("renders a button to upload a file", () => {
    const mockSetFiles = vi.fn();

    render(<FileUploadButton files={[]} setFiles={mockSetFiles} />);
    const fileUploadButton = screen.getByRole("button", {
      name: "Datei auswählen",
    });
    expect(fileUploadButton).toBeInTheDocument();
    expect(fileUploadButton).toHaveClass("ds-button-tertiary");
  });

  it("renders a button to upload more files", () => {
    const mockedFilesArray = [
      new File([""], "testfile0.pdf", {
        type: "application/pdf",
      }),
    ];

    const mockSetFiles = vi.fn();

    render(
      <FileUploadButton files={mockedFilesArray} setFiles={mockSetFiles} />,
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

  it("uploads a file", async () => {
    const mockedFilesArray = [
      new File([""], "testfile0.pdf", {
        type: "application/pdf",
      }),
    ];

    const mockSetFiles = vi.fn();

    render(<FileUploadButton files={[]} setFiles={mockSetFiles} />);

    const user = userEvent.setup();
    const input = screen.getByTestId("fileUpload");

    await user.upload(input, mockedFilesArray);
    expect(mockSetFiles).toHaveBeenCalledWith(mockedFilesArray);
  });
  it("uploads multiple files", async () => {
    const mockedFilesArray = [
      new File([""], "testfile0.pdf", {
        type: "application/pdf",
      }),
      new File([""], "testfile1.pdf", {
        type: "application/pdf",
      }),
    ];

    const mockSetFiles = vi.fn();

    render(<FileUploadButton files={[]} setFiles={mockSetFiles} />);

    const user = userEvent.setup();
    const input = screen.getByTestId("fileUpload");

    await user.upload(input, mockedFilesArray);
    expect(mockSetFiles).toHaveBeenCalledWith(mockedFilesArray);
  });
});
