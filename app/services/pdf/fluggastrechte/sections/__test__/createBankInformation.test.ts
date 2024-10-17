import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createBankInformation } from "../createBankInformation";

describe("createBankInformation", () => {
  it("should create document with bank information ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createBankInformation(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Kontoinhaber: Test-Test Müller | IBAN: DE68500123456789000000",
      expect.anything(),
      expect.anything(),
    );
  });
});
