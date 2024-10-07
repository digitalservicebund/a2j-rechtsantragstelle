import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  createMainTitle,
  MAIN_TITLE,
  SECONDARY_TITLE,
} from "../createMainTitle";

describe("createMainTitle", () => {
  it("should create document with the main and secondary title ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createMainTitle(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H1", {}, expect.any(Function));
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(MAIN_TITLE, { align: "left" });

    expect(mockDoc.text).toHaveBeenCalledWith(SECONDARY_TITLE);
  });
});
