import { type Mock } from "vitest";
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
    const mockSect = mockDoc.struct("Sect");

    addOtherDetailsItinerary(
      mockDoc,
      mockSect,
      userDataMock.zusaetzlicheAngaben,
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      OTHER_DETAILS_ITINERARY,
      expect.anything(),
    );

    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.zusaetzlicheAngaben);
  });

  it("should not have the text for other details itinerary in case zusaetzlicheAngaben is not defined", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    addOtherDetailsItinerary(mockDoc, mockSect);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      OTHER_DETAILS_ITINERARY,
      expect.anything(),
    );
    // Added to silence ESLint warning: "Add at least one assertion to this test case.eslintsonarjs/assertions-in-tests"
    expect(mockDoc.text).toBeDefined();
  });
});

describe("addOtherDetailsItinerary - accessibility", () => {
  it("should call addOtherDetailsItinerary with one paragraph if zusaetzlicheAngaben is defined", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addOtherDetailsItinerary(
      mockDoc,
      mockStruct,
      userDataMock.zusaetzlicheAngaben,
    );
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(1);
  });
  it("should call addOtherDetailsItinerary with no paragraph if zusaetzlicheAngaben is not defined", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addOtherDetailsItinerary(mockDoc, mockStruct);
    expect(mockDoc.struct).not.toHaveBeenCalledWith(
      "P",
      {},
      expect.any(Function),
    );
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(0);
  });
});
