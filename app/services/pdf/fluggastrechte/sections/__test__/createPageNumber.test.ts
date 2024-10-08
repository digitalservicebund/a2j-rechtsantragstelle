import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createPageNumber } from "../createPageNumber";

describe("createPageNumber", () => {
  it("should create document with page number ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const expectPageNumber = 2;

    createPageNumber(mockDoc, { pageNumber: expectPageNumber });

    expect(mockDoc.text).toHaveBeenCalledWith(
      `${expectPageNumber}/3`,
      expect.anything(),
      expect.anything(),
      {
        align: "right",
      },
    );
  });
});
