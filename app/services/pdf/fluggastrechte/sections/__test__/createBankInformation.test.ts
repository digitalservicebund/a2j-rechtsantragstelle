import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createBankInformation } from "../createBankInformation";

describe("createBankInformation", () => {
  it("should create document with bank information ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createBankInformation(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Kontoinhaber: Name, Vorname | IBAN: XXXXXXXXXXXXXXXXXXXX",
      expect.anything(),
      expect.anything(),
    );
  });
});
