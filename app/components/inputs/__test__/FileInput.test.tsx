import { render } from "@testing-library/react";
import * as FileInputFunctions from "~/components/inputs/FileInput";
import { CSRFKey } from "~/services/security/csrf/csrfKey";

const FileInput = FileInputFunctions.FileInput;

const useLoaderDataMock = vi.hoisted(() =>
  vi.fn(() => ({
    csrf: "csrf",
  })),
);

const submitMock = vi.fn();
vi.mock("@remix-run/react", () => ({
  useLoaderData: useLoaderDataMock,
  useSubmit: () => submitMock,
}));
const mockFile = new File([], "mockFile");
const inputName = "belege[0]";

describe("useFileHandler", () => {
  it("should return a file upload handler", () => {
    const { onFileUpload } = FileInputFunctions.useFileHandler();
    expect(onFileUpload).toBeDefined();
    expect(useLoaderDataMock).toHaveBeenCalled();
    const mockFormData = new FormData();
    mockFormData.append("_action", `fileUpload.fieldName`);
    mockFormData.append(CSRFKey, "csrf");
    mockFormData.append("fieldName", mockFile);
    onFileUpload("fieldName", mockFile);
    expect(submitMock).toHaveBeenCalledWith(mockFormData, {
      method: "post",
      encType: "multipart/form-data",
    });
  });

  it("should return a file deletion handler", () => {
    const { onFileDelete } = FileInputFunctions.useFileHandler();
    expect(onFileDelete).toBeDefined();
    expect(useLoaderDataMock).toHaveBeenCalled();
    const mockFormData = new FormData();
    mockFormData.append("_action", `deleteFile.fieldName`);
    mockFormData.append(CSRFKey, "csrf");
    onFileDelete("fieldName");
    expect(submitMock).toHaveBeenCalledWith(mockFormData, {
      method: "post",
      encType: "multipart/form-data",
    });
  });
});

describe("FileInput", () => {
  it("should render correctly if javascript is enabled", () => {
    const helperText = "Input a file";
    const selectFilesButtonLabel = "Select a file";
    const { getByText, getByTestId } = render(
      <FileInput
        name={inputName}
        selectedFile={undefined}
        jsAvailable={true}
        helperText={helperText}
        selectFilesButtonLabel={selectFilesButtonLabel}
      />,
    );
    expect(getByText(selectFilesButtonLabel)).toBeInTheDocument();
    const input = getByTestId("fileUploadInput");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass(
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer",
    );
    expect(getByText(selectFilesButtonLabel)).toBeInTheDocument();
    expect(getByText(helperText)).toBeInTheDocument();
  });

  it("should render correctly without javascript", () => {
    const { getByTestId, getByRole } = render(
      <FileInput
        name={inputName}
        selectedFile={undefined}
        jsAvailable={false}
      />,
    );
    const input = getByTestId("fileUploadInput");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass(
      "body-01-reg m-8 ml-0 file:ds-button file:ds-button-tertiary w-full",
    );
    expect(input).not.toHaveClass(
      "w-0.1 h-0.1 opacity-0 overflow-hidden absolute z-0 cursor-pointer",
    );
    const uploadButton = getByRole("button");
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toHaveAttribute("type", "submit");
    expect(uploadButton).toHaveAttribute("name", "_action");
    expect(uploadButton).toHaveAttribute("value", `fileUpload.${inputName}`);
  });
});

describe("convertFileToMetadata", () => {
  it("should set default values when a file is not provided", () => {
    const result = FileInputFunctions.convertFileToMetadata();
    expect(result).toEqual({
      filename: "",
      fileType: "",
      fileSize: 0,
      createdOn: "",
    });
  });

  it("should successfully convert a file to metadata", () => {
    const mockFile = new File([], "filename", { type: "application/pdf" });
    const result = FileInputFunctions.convertFileToMetadata(mockFile);
    expect(result).toEqual({
      filename: "filename",
      fileType: "application/pdf",
      fileSize: 0,
      createdOn: new Date(mockFile.lastModified).toString(),
    });
  });
});
