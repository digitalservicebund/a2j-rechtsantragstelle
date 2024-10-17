import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  addPlannedFlightDetails,
  AFFECTED_FLIGHT_TEXT,
  DUE_REASON_TEXT,
  FLIGHT_NUMBER_TEXT,
  PLANNED_DEPARTURE_DATE_TEXT,
} from "../addPlannedFlightDetails";

describe("addPlannedFlightDetails", () => {
  it("should create document with flight details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addPlannedFlightDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(DUE_REASON_TEXT);
    expect(mockDoc.text).toHaveBeenCalledWith(AFFECTED_FLIGHT_TEXT);
    expect(mockDoc.text).toHaveBeenCalledWith(FLIGHT_NUMBER_TEXT, {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(PLANNED_DEPARTURE_DATE_TEXT, {
      continued: true,
    });
  });
});