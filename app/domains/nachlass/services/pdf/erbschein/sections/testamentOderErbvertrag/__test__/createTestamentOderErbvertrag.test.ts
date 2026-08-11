import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { createTestamentOderErbvertrag } from "~/domains/nachlass/services/pdf/erbschein/sections/testamentOderErbvertrag/createTestamentOderErbvertrag";

describe("createTestamentOderErbvertrag", () => {
  it("should print the details of the testament or erbvertrag", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    createTestamentOderErbvertrag(mockDoc, mockStruct, {
      testamentArt: "handwritten",
    });
    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.text).toHaveBeenCalledWith("Verfügung von Todes wegen: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Handschriftliches Testament");
  });
});
