import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addAirlineDetails } from "../addAirlineDetails";

describe("addAirlineDetails", () => {
  it("should generate document with airline details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAirlineDetails(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Deutsche Lufthansa Aktiengesellschaft",
      { continued: true },
    );
  });
});
