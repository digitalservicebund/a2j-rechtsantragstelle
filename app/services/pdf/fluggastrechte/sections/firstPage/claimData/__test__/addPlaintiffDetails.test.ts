import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addPlaintiffDetails, PLAINTIFF_TEXT } from "../addPlaintiffDetails";

describe("addPlaintiffDetails", () => {
  it("should create document with plaintiff details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addPlaintiffDetails(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith("Włodzimierz Ciesiński", {
      continued: true,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(PLAINTIFF_TEXT, {
      align: "left",
    });
  });
});
