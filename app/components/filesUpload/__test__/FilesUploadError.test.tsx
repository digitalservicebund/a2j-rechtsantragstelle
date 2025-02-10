import { render, screen } from "@testing-library/react";
import { FilesUploadError } from "../FilesUploadError";

describe("FilesUploadError", () => {
  it("renders correctly an error message", () => {
    render(<FilesUploadError errorMessage={"Error message"} />);
    const errorIcon = screen.getByTestId("ErrorOutlineIcon");
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveClass("shrink-0 fill-red-900 mr-10");
    const errorMessage = screen.getByText("Error message");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-900 text-base");
  });
});
