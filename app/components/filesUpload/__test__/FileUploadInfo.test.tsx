import { render, screen } from "@testing-library/react";
import { FileUploadInfo } from "../FileUploadInfo";

describe("FileUploadInfo", () => {
  it("renders an icon, file name and size", () => {
    render(<FileUploadInfo fileName={"testfile1.pdf"} fileSize={3145728} />);
    const fileNames = screen.getByText("testfile1.pdf");
    const fileIcon = screen.getByTestId("InsertDriveFileIcon");
    expect(fileNames).toBeInTheDocument();
    expect(fileNames).toHaveClass(
      "text-base text-black font-400 mr-8 ml-10 truncate",
    );
    expect(fileIcon).toBeInTheDocument();
    expect(fileIcon).toHaveClass("shrink-0 fill-gray-900");
  });
});
