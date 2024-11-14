import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { createBankInformation } from "../createBankInformation";

describe("createBankInformation", () => {
  it("should create document with bank information when account holder is provided", () => {
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

  it("should default to vorname and nachname if account holder is missing", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataNoAccountHolder = {
      ...userDataMock,
      kontoinhaber: undefined,
      vorname: "Max",
      nachname: "Mustermann",
    };

    createBankInformation(mockDoc, mockStruct, userDataNoAccountHolder);

    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Kontoinhaber: Mustermann, Max | IBAN: DE68500123456789000000",
      expect.anything(),
      expect.anything(),
    );
  });

  it("should not add bank information if IBAN is missing", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataWithoutIban = { ...userDataMock, iban: undefined };

    createBankInformation(mockDoc, mockStruct, userDataWithoutIban);

    expect(mockDoc.struct).not.toHaveBeenCalled();
    expect(mockDoc.text).not.toHaveBeenCalled();
  });

  it("should use correct font and size", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createBankInformation(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.fontSize).toHaveBeenCalledWith(7);
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
  });

  it("should position text correctly in the document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createBankInformation(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      expect.any(String),
      PDF_MARGIN_HORIZONTAL,
      PDF_HEIGHT_SEIZE,
    );
  });

  it("should handle special characters in kontoinhaber", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataSpecialChars = {
      ...userDataMock,
      kontoinhaber: "Jöhn Dœ!💰",
    };

    createBankInformation(mockDoc, mockStruct, userDataSpecialChars);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Kontoinhaber: Jöhn Dœ!💰 | IBAN: DE68500123456789000000",
      expect.anything(),
      expect.anything(),
    );
  });
});
