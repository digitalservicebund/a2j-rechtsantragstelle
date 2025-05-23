import { type ValidationErrorResponseData } from "@rvf/react-router";
import { fireEvent, render } from "@testing-library/react";
import times from "lodash/times";
import { createMemoryRouter, RouterProvider } from "react-router";
import FilesUpload, {
  type FilesUploadProps,
} from "~/components/filesUpload/FilesUpload";
import { type Context } from "~/domains/userData";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { type PDFFileMetadata } from "~/util/file/pdfFileSchema";

const deleteLabel = "Löschen";
const selectLabel = "Datei Auswählen";
const addAnotherLabel = "Weitere Datei Auswahlen";

const fieldName = "belege";
const minimumFileError = "You must select at least one file";

const mockSubmit = vi.fn();
let actionResponse: ValidationErrorResponseData | Context | undefined;
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useLoaderData: vi.fn(() => ({ csrf: "csrf" })),
  useActionData: () => actionResponse,
  useSubmit: () => mockSubmit,
}));

vi.mock("~/services/translations/translationsContext", () => ({
  useTranslations: () => ({
    fileUpload: {
      delete: deleteLabel,
      select: selectLabel,
      addAnother: addAnotherLabel,
    },
  }),
}));

const getDefaultMock = vi.fn();
const getErrorMock = vi.fn();

vi.mock("@rvf/react-router", () => ({
  useField: () => ({
    getInputProps: vi.fn((props) => ({ ...props })),
    defaultValue: getDefaultMock,
    error: getErrorMock,
  }),
}));

const mockDefaultValue = (value: PDFFileMetadata[]) => {
  getDefaultMock.mockReturnValue(value);
};

const mockError = (error: string) => {
  getErrorMock.mockReturnValue(error);
};

const renderFilesUpload = ({ ...args }: Partial<FilesUploadProps> = {}) =>
  render(
    <RouterProvider
      router={createMemoryRouter([
        {
          path: "/",
          element: <FilesUpload name={fieldName} {...args} />,
        },
      ])}
    />,
  );

beforeEach(() => {
  vi.resetAllMocks();
});

describe("FilesUpload", () => {
  it("should render an empty list", () => {
    const title = "Add Files";
    const description = "Add some files here";
    const { getByText, queryByText } = renderFilesUpload({
      title,
      description,
    });
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(description)).toBeInTheDocument();
    expect(getByText(selectLabel)).toBeInTheDocument();
    expect(queryByText(addAnotherLabel)).not.toBeInTheDocument();
  });

  it("should allow a user to add a file", () => {
    const mockFile = new File(["Mocked file"], "test.pdf", {
      type: "application/pdf",
    });
    const { getByTestId } = renderFilesUpload();
    const input = getByTestId(
      "file-upload-input-belege[0]",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [mockFile] } });
    expect(input.files).toHaveLength(1);
    const mockFormData = new FormData();
    mockFormData.append("_action", `fileUpload.${fieldName}[0]`);
    mockFormData.append(CSRFKey, "csrf");
    mockFormData.append(`${fieldName}[0]`, mockFile);
    const submittedFormData = mockSubmit.mock.calls.at(-1)?.at(0) as FormData;
    for (const [key] of submittedFormData.entries()) {
      expect(submittedFormData.get(key)).toEqual(mockFormData.get(key));
    }
  });

  it("should allow a user to delete a file", () => {
    mockDefaultValue([
      {
        filename: "test.pdf",
        fileType: "application/pdf",
        fileSize: 1000,
      },
    ]);

    const { getByText } = renderFilesUpload();
    const deleteButton = getByText(deleteLabel);
    expect(deleteButton).toBeInTheDocument();
    expect(getByText(addAnotherLabel)).toBeInTheDocument();
    fireEvent.click(deleteButton);
    const mockFormData = new FormData();
    mockFormData.append("_action", `deleteFile.${fieldName}[0]`);
    mockFormData.append(CSRFKey, "csrf");
    const submittedFormData = mockSubmit.mock.calls.at(-1)?.at(0) as FormData;
    for (const [key] of submittedFormData.entries()) {
      expect(submittedFormData.get(key)).toEqual(mockFormData.get(key));
    }
  });

  it("should display a top-level error", () => {
    mockError(minimumFileError);
    const { getByText, queryByText } = renderFilesUpload();
    expect(getByText(minimumFileError)).toBeInTheDocument();
    expect(queryByText(addAnotherLabel)).not.toBeInTheDocument();
  });

  it("should render individual file input errors", () => {
    actionResponse = {
      fieldErrors: {
        [`${fieldName}[0]`]: "fileSizeTooBig",
      },
    };
    mockDefaultValue([
      {
        filename: "test.pdf",
        fileType: "application/pdf",
        fileSize: 0,
      },
    ]);
    const { getByText, queryByText } = renderFilesUpload();
    expect(getByText("fileSizeTooBig")).toBeInTheDocument();
    expect(queryByText(addAnotherLabel)).not.toBeInTheDocument();
  });

  it('should hide the "add another" button when the file upload limit is reached', () => {
    const defaultValueMocked = times(5).map(() => ({
      filename: "test.pdf",
      fileType: "application/pdf",
      fileSize: 0,
    }));

    mockDefaultValue(defaultValueMocked);

    const { queryByText } = renderFilesUpload();
    expect(queryByText(addAnotherLabel)).not.toBeInTheDocument();
  });
});
