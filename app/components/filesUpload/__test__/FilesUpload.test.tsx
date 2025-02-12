import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilesUpload } from "../FilesUpload";
describe("FilesUpload", () => {
  const mockUploadFile = vi.fn();

  const defaultProps = {
    title: "Upload Files",
    inputName: "fileUpload",
    uploadFile: mockUploadFile,
    warningTitle: "Warning",
    warningDescription: "This is a warning",
    labels: {
      cancelButtonLabel: "Cancel",
      deleteButtonLabel: "Delete",
      uploadProgressLabel: "Uploading...",
      selectFilesButtonLabel: "Select Files",
      selectMoreFilesButtonLabel: "Select More Files",
    },
  };

  beforeEach(() => {
    mockUploadFile.mockReset();
  });

  it("renders the initial not started state correctly", () => {
    render(<FilesUpload {...defaultProps} />);

    const title = screen.getByText("Upload Files");
    expect(title).toBeInTheDocument();
    const input = screen.getByTestId("fileUploadInput");
    expect(input).toBeInTheDocument();
    const selectFilesButton = screen.getByRole("button", {
      name: "Select Files",
    });
    expect(selectFilesButton).toBeInTheDocument();
  });

  it("handles file selection and upload success", async () => {
    mockUploadFile.mockResolvedValue(undefined);
    render(<FilesUpload {...defaultProps} />);

    const user = userEvent.setup();
    const file = new File([""], "testfile0.pdf", { type: "application/pdf" });
    const fileSizeMegabytesToBytes = 8388608;
    Object.defineProperty(file, "size", {
      value: fileSizeMegabytesToBytes,
    });

    const input = screen.getByTestId("fileUploadInput");
    await user.upload(input, file);
    expect(mockUploadFile).toHaveBeenCalledWith(file);
    const fileName = screen.getByText("testfile0.pdf");
    expect(fileName).toBeInTheDocument();
    const fileSize = screen.getByText("8 MB");
    expect(fileSize).toBeInTheDocument();
    const deleteButton = screen.getByRole("button", {
      name: "Delete",
    });
    expect(deleteButton).toBeInTheDocument();
  });

  it("handles file selection and upload in progress", async () => {
    mockUploadFile.mockReturnValue(new Promise(vi.fn()));
    render(<FilesUpload {...defaultProps} />);

    const user = userEvent.setup();
    const file = new File([""], "testfile0.pdf", { type: "application/pdf" });
    const input = screen.getByTestId("fileUploadInput");

    await user.upload(input, file);
    expect(mockUploadFile).toHaveBeenCalledWith(file);

    const fileName = screen.getByText("testfile0.pdf");
    expect(fileName).toBeInTheDocument();
    const uploadProgress = screen.getByText("Uploading...");
    expect(uploadProgress).toBeInTheDocument();
  });

  it("handles file selection and upload failure", async () => {
    mockUploadFile.mockRejectedValue(undefined);
    render(<FilesUpload {...defaultProps} />);

    const user = userEvent.setup();
    const file = new File([""], "testfile0.pdf", { type: "application/pdf" });
    const input = screen.getByTestId("fileUploadInput");
    await user.upload(input, file);
    expect(mockUploadFile).toHaveBeenCalledWith(file);
    const fileName = screen.queryByText("testfile0.pdf");
    expect(fileName).not.toBeInTheDocument();
    const errorMessage = screen.getByText("Upload failed");
    expect(errorMessage).toBeInTheDocument();
  });

  it("renders a warning message when file limit reached", async () => {
    mockUploadFile.mockReturnValue(5);
    render(<FilesUpload {...defaultProps} />);

    const user = userEvent.setup();
    const files = 
      [new File([""], "testfile0.pdf", { type: "application/pdf" })]
    const input = screen.getByTestId("fileUploadInput");
    await user.upload(input, file);
    expect(mockUploadFile).toHaveBeenCalledWith(file);
    expect(mockUploadFile).toHaveBeenCalledTimes(5)
    const addMoreFileButton = screen.getByRole("button", {name: "Select More Files"})
    expect(addMoreFileButton).not.toBeInTheDocument();
    const warningTitle = screen.getByText("Warning Title");
    expect(warningTitle).toBeInTheDocument();
    const warningDescription = screen.getByText("Warning Description");
    expect(warningDescription).toBeInTheDocument();
  })

});
