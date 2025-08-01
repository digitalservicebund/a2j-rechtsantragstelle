import { type Mock } from "vitest";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import {
  addPlannedFlightDetails,
  AFFECTED_FLIGHT_TEXT,
  FLIGHT_NUMBER_TEXT,
  PLANNED_DEPARTURE_DATE_TEXT,
} from "../addPlannedFlightDetails";

vi.mock("~/domains/fluggastrechte/formular/services/getTotalCompensationClaim");

describe("addPlannedFlightDetails", () => {
  it("should create document with flight details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    addPlannedFlightDetails(mockDoc, mockStruct, userDataMock);
    expect(mockDoc.text).toHaveBeenCalledWith(AFFECTED_FLIGHT_TEXT);
    expect(mockDoc.text).toHaveBeenCalledWith(FLIGHT_NUMBER_TEXT, {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      ` ${userDataMock.direktFlugnummer}`,
    );
    expect(mockDoc.text).toHaveBeenCalledWith(PLANNED_DEPARTURE_DATE_TEXT, {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith(
      ` ${userDataMock.direktAbflugsDatum}`,
    );
  });

  it("should calculate compensation based on start and end airport", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockCompensation = 400;
    vi.mocked(getTotalCompensationClaim).mockReturnValue(mockCompensation);

    addPlannedFlightDetails(mockDoc, mockStruct, userDataMock);

    expect(getTotalCompensationClaim).toHaveBeenCalled();
    expect(mockDoc.text).toHaveBeenCalledWith(
      `Streitwert: ${mockCompensation} €`,
    );
  });
});

describe("addPlannedFlightDetails - accessibility", () => {
  it("should call the addPlannedFlightDetails with a List", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    mockDoc.y = 200;
    mockDoc.fillOpacity = vi.fn().mockReturnThis();

    addPlannedFlightDetails(mockDoc, mockStruct, userDataMock);
    expect(mockDoc.struct).toHaveBeenCalledWith("L");
    expect(mockDoc.struct).toHaveBeenCalledWith("LI");
    expect(mockDoc.struct).toHaveBeenCalledWith(
      "LBody",
      {},
      expect.any(Function),
    );
    const callsWithList = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "L",
    );
    const callsWithListItem = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "LI",
    );
    const callsWithListBody = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "LBody",
    );
    expect(callsWithList).toHaveLength(1);
    expect(callsWithListItem).toHaveLength(3);
    expect(callsWithListBody).toHaveLength(3);
  });
});
