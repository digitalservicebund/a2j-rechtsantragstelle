import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import {
  addOtherDetailsItinerary,
  OTHER_DETAILS_ITINERARY,
} from "../addOtherDetailsItinerary";

describe("addOtherDetailsItinerary", () => {
  it("should have the text for other details itinerary in case the zusaetzlicheAngaben is defined ", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addOtherDetailsItinerary(mockDoc, userDataMock.zusaetzlicheAngaben);

    expect(mockDoc.text).toHaveBeenCalledWith(
      OTHER_DETAILS_ITINERARY,
      expect.anything(),
    );

    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.zusaetzlicheAngaben);
  });

  it("should not have the text for other details itinerary in case zusaetzlicheAngaben is not defined", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addOtherDetailsItinerary(mockDoc);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      OTHER_DETAILS_ITINERARY,
      expect.anything(),
    );
  });
});
