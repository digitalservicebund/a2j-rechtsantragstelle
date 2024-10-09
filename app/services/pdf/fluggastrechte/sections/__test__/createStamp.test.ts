import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createStamp, STAMP_TEXT, STAMP_TEXT_WIDTH } from "../createStamp";

describe("createStamp", () => {
  it("should create document with stamp ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createStamp(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(
      STAMP_TEXT,
      expect.anything(),
      expect.anything(),
      {
        align: "center",
        baseline: "middle",
        width: STAMP_TEXT_WIDTH,
      },
    );
  });
});
