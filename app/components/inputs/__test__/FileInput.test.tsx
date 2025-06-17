import { render } from "@testing-library/react";
import { FileInput } from "~/components/inputs/FileInput";
import { translations } from "~/services/translations/translations";

vi.mock("react-router", () => ({
  useLoaderData: vi.fn(() => ({ csrf: "csrf" })),
  useSubmit: vi.fn(),
}));

const selectFilesButtonLabel = translations.fileUpload.select.de;

const inputName = "belege[0]";

describe("FileInput", () => {
  it("should render correctly if javascript is enabled", () => {
    const helperText = "Input a file";
    const { getByText, getByTestId } = render(
      <FileInput
        name={inputName}
        selectedFile={undefined}
        jsAvailable={true}
        helperText={helperText}
      />,
    );
    expect(getByText(selectFilesButtonLabel)).toBeInTheDocument();
    const input = getByTestId("file-upload-input-belege[0]");
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
    const input = getByTestId("file-upload-input-belege[0]");
    expect(input).toBeInTheDocument();
    const uploadButton = getByRole("button");
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toHaveAttribute("type", "submit");
    expect(uploadButton).toHaveAttribute("name", "_action");
    expect(uploadButton).toHaveAttribute("value", `fileUpload.${inputName}`);
  });
});
