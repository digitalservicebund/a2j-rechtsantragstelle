import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
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
