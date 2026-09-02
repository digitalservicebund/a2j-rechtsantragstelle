import { render } from "@testing-library/react";
import { FileInput } from "../FileInput";

vi.mock("react-router", () => ({
  useRouteLoaderData: vi.fn(() => ({ csrf: "csrf" })),
  useSubmit: vi.fn(),
}));

import { componentsTranslations } from "~/services/translations/components";
const selectFilesButtonLabel = componentsTranslations.fileUpload.select.de;

const inputName = "belege[0]";

describe("FileInput", () => {
  it("should render correctly if javascript is enabled", () => {
    const helperText = "Input a file";
    const { getByText } = render(
      <FileInput
        name={inputName}
        selectedFile={undefined}
        jsAvailable={true}
        helperText={helperText}
      />,
    );
    expect(getByText(selectFilesButtonLabel)).toBeInTheDocument();
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
