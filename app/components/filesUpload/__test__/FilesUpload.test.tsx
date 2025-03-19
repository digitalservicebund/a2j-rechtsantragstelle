import { fireEvent, render } from "@testing-library/react";
import times from "lodash/times";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { ValidationErrorResponseData } from "remix-validated-form";
import FilesUpload, {
  FilesUploadProps,
} from "~/components/filesUpload/FilesUpload";
import { Context } from "~/domains/contexts";
import { CSRFKey } from "~/services/security/csrf/csrfKey";
import { fileUploadErrorMap, PDFFileMetadata } from "~/util/file/pdfFileSchema";

const deleteLabel = "Löschen";
const selectLabel = "Datei Auswählen";
const addAnotherLabel = "Weitere Datei Auswahlen";

const fieldName = "belege";
const minimumFileError = "You must select at least one file";

const mockSubmit = vi.fn();
let actionResponse: ValidationErrorResponseData | Context | undefined;
vi.mock("@remix-run/react", async () => ({
  ...(await vi.importActual("@remix-run/react")),
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

let defaultValue: PDFFileMetadata[] = [];
let error: string | undefined;
vi.mock("remix-validated-form", () => ({
  useField: () => ({
    defaultValue,
    error,
  }),
}));

beforeEach(() => {
  defaultValue = [];
  actionResponse = undefined;
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
    const input = getByTestId("fileUploadInput") as HTMLInputElement;
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
    defaultValue = [
      {
        filename: "test.pdf",
        fileType: "application/pdf",
        fileSize: 1000,
        createdOn: new Date().toString(),
      },
    ];
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
    error = minimumFileError;
    const { getByText, queryByText } = renderFilesUpload();
    expect(getByText(minimumFileError)).toBeInTheDocument();
    expect(queryByText(addAnotherLabel)).not.toBeInTheDocument();
  });

  it("should render individual file input errors", () => {
    actionResponse = {
      fieldErrors: {
        [`${fieldName}[0]`]: fileUploadErrorMap.fileSizeTooBig,
      },
    };
    defaultValue = [
      {
        filename: "test.pdf",
        fileType: "application/pdf",
        fileSize: 0,
        createdOn: new Date().toString(),
      },
    ];
    const { getByText, queryByText } = renderFilesUpload();
    expect(getByText(fileUploadErrorMap.fileSizeTooBig)).toBeInTheDocument();
    expect(queryByText(addAnotherLabel)).not.toBeInTheDocument();
  });

  it('should hide the "add another" button when the file upload limit is reached', () => {
    defaultValue = times(5).map(() => ({
      filename: "test.pdf",
      fileType: "application/pdf",
      fileSize: 0,
      createdOn: new Date().toString(),
    }));
    const { queryByText } = renderFilesUpload();
    expect(queryByText(addAnotherLabel)).not.toBeInTheDocument();
  });
});

const renderFilesUpload = ({ ...args }: Partial<FilesUploadProps> = {}) =>
  render(
    <RouterProvider
      router={createMemoryRouter([
        {
          path: "/",
          element: <FilesUpload name={fieldName} formId="formId" {...args} />,
        },
      ])}
    />,
  );
