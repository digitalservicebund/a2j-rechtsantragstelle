import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilesUploadInput } from "../FilesUploadInput";

describe.skip("FilesUploadInput", () => {
  it("renders an upload files input", () => {
    render(<FilesUploadInput />);
    const filesUploadInput = screen.getByTestId("filesUpload");
    expect(filesUploadInput).toBeInTheDocument();
    expect(filesUploadInput).toHaveClass(
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer",
    );
    expect(filesUploadInput).toHaveAttribute("multiple");
    expect(filesUploadInput).toHaveAttribute("type", "file");
    expect(filesUploadInput).toHaveAttribute("accept", ".pdf, .tiff, .tif");
  });
  it("renders an upload files button", () => {
    render(<FilesUploadInput />);
    const filesUploadButton = screen.getByRole("button", {
      name: "Datei auswählen",
    });
    expect(filesUploadButton).toBeInTheDocument();
    expect(filesUploadButton).toHaveClass("ds-button-tertiary");
  });
  it("uploads a file", async () => {
    const mockedFilesArray = [
      new File([""], "testfile0.pdf", {
        type: "application/pdf",
      }),
    ];

    const mockSetFiles = vi.fn();

    render(<FilesUploadInput />);

    const user = userEvent.setup();
    const input = screen.getByTestId("filesUpload");

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

    render(<FilesUploadInput />);

    const user = userEvent.setup();
    const input = screen.getByTestId("filesUpload");

    await user.upload(input, mockedFilesArray);
    expect(mockSetFiles).toHaveBeenCalledWith(mockedFilesArray);
  });
});
