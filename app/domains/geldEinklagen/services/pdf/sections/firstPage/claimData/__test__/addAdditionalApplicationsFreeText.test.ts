import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addAdditionalApplicationsFreeText } from "../addAdditionalApplicationsFreeText";

describe("addAdditionalApplicationsFreeText", () => {
  it("should not add free text application section if no free text application is provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAdditionalApplicationsFreeText(mockDoc, undefined, mockStruct);

    expect(mockDoc.struct).not.toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).not.toHaveBeenCalledWith(
      "H3",
      {},
      expect.any(Function),
    );
    expect(mockDoc.text).not.toHaveBeenCalledWith("Weitere Anträge:");
  });

  it("should add free text application section if free text application is provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const freeTextApplication = "This is a free text application.";
    addAdditionalApplicationsFreeText(mockDoc, freeTextApplication, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("H3", {}, expect.any(Function));
    expect(mockDoc.text).toHaveBeenCalledWith("Weitere Anträge:");
    expect(mockDoc.text).toHaveBeenCalledWith(
      freeTextApplication,
      expect.any(Number),
    );
  });
});
