import { render } from "@testing-library/react";
import { FileInput } from "~/components/inputs/FileInput";

vi.mock("@remix-run/react", () => ({
  useLoaderData: vi.fn(() => ({ csrf: "csrf" })),
  useSubmit: vi.fn(),
}));

const selectFilesButtonLabel = "Select a file";
vi.mock("~/services/translations/translationsContext", () => ({
  useTranslations: () => ({
    fileUpload: {
      select: selectFilesButtonLabel,
    },
  }),
}));

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
