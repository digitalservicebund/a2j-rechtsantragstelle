import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createPageNumber } from "../createPageNumber";

describe("createPageNumber", () => {
  it("should create document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 1, count: 1 });

    const expectPageNumber = 2;

    createPageNumber(mockDoc);

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
