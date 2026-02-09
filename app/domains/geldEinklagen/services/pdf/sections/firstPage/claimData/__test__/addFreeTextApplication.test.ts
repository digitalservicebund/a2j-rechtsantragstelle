import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addFreeTextApplication } from "../addFreeTextApplication";

describe("addFreeTextApplication", () => {
  it("should not add free text application section if no free text application is provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFreeTextApplication(mockDoc, undefined, mockStruct);

    expect(mockDoc.struct).not.toHaveBeenCalledWith("Sect");
  });

  it("should add free text application section if free text application is provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const freeTextApplication = "This is a free text application.";
    addFreeTextApplication(mockDoc, freeTextApplication, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.text).toHaveBeenCalledWith(
      freeTextApplication,
      expect.any(Number),
    );
  });
});
