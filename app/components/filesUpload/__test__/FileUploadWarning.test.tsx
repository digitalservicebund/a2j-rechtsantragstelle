import { render, screen } from "@testing-library/react";
import { FileUploadWarning } from "../FileUploadWarning";

describe("FileUploadWarning", () => {
  it("renders correctly an error message", () => {
    render(
      <FileUploadWarning
        warningTitle={"Warning Title"}
        warningDescription={"Warning Description"}
      />,
    );
    const infoIcon = screen.getByTestId("LightbulbOutlinedIcon");
    expect(infoIcon).toBeInTheDocument();
    expect(infoIcon).toHaveClass("shrink-0");
    const warningTitle = screen.getByText("Warning Title");
    expect(warningTitle).toBeInTheDocument();
    expect(warningTitle).toHaveClass("text-black text-lg font-bold p-4");
    const warningDescription = screen.getByText("Warning Description");
    expect(warningDescription).toBeInTheDocument();
    expect(warningDescription).toHaveClass("text-black text-lg p-4");
  });
});
