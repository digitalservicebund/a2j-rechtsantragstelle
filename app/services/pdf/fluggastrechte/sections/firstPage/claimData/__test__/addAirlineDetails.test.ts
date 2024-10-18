import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addAirlineDetails } from "../addAirlineDetails";

describe("addAirlineDetails", () => {
  it("should generate document with airline details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addAirlineDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Deutsche Lufthansa AG", {
      continued: true,
    });
  });
});
