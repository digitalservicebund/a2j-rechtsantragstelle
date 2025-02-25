import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createPageNumber } from "../createPageNumber";

describe("createPageNumber", () => {
  it("should create document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 1, count: 1 });

    const expectPageNumber = 1;

    createPageNumber(mockDoc, mockStruct, 1, 1);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `${expectPageNumber}/1`,
      expect.anything(),
      expect.anything(),
      {
        align: "right",
        lineBreak: false,
      },
    );
  });

  it("should create document with pageNumberPrefix", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct, { start: 1, count: 1 });

    const expectPageNumber = "Page 1/1";

    createPageNumber(mockDoc, mockStruct, 1, 1, "Page");

    expect(mockDoc.text).toHaveBeenCalledWith(
      expectPageNumber,
      expect.anything(),
      expect.anything(),
      {
        align: "right",
        lineBreak: false,
      },
    );
  });
});
