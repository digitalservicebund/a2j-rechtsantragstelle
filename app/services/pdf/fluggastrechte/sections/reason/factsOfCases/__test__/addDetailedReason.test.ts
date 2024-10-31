import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/fluggastrechte/createPdfKitDocument";
import {
  addDetailedReason,
  ATTACHMENT_CONFIRM_BOOKING_TEXT,
  CONFIRM_BOOKING_TEXT,
  MARGIN_RIGHT,
  PLAINTIFF_ON_TIME_TEXT,
} from "../addDetailedReason";

vi.mock("~/services/airports/getAirportNameByIataCode");

const startAirportMock = "BERLIN";
const endAirportMock = "NEW YORK";

beforeEach(() => {
  vi.mocked(getAirportNameByIataCode).mockImplementation((airport) => {
    if (airport === "BER") {
      return startAirportMock;
    }

    return endAirportMock;
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("addDetailedReason", () => {
  it("should have the text for booking confirm and attachment booking confirm", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDetailedReason(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(CONFIRM_BOOKING_TEXT);

    expect(mockDoc.text).toHaveBeenCalledWith(
      ATTACHMENT_CONFIRM_BOOKING_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
    );
  });

  it("should have the text for plaintiff on time for verspaetet bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDetailedReason(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      PLAINTIFF_ON_TIME_TEXT,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should not have the text for plaintiff on time for annullierung bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataAnnullierung = {
      ...userDataMock,
      bereich: "annullierung",
    };

    addDetailedReason(mockDoc, mockStruct, userDataAnnullierung);

    expect(mockDoc.text).not.toHaveBeenCalledWith(
      PLAINTIFF_ON_TIME_TEXT,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for plaintiff on time for nichtbefoerderung bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataNichtBefoerderungMock = {
      ...userDataMock,
      bereich: "nichtbefoerderung",
    };

    addDetailedReason(mockDoc, mockStruct, userDataNichtBefoerderungMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      PLAINTIFF_ON_TIME_TEXT,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for verspaetet bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDetailedReason(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Der Flug von ${startAirportMock} nach ${endAirportMock} hatte die genannte Verspätung. Aufgrund der Verspätung wurde der Anschlussflug verpasst.`,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for annullierung bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataAnnullierung = {
      ...userDataMock,
      bereich: "annullierung",
    };

    addDetailedReason(mockDoc, mockStruct, userDataAnnullierung);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Der Flug von ${startAirportMock} nach ${endAirportMock} wurde annulliert. Aufgrund der Annullierung wurde der Anschlussflug verpasst.`,
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for start and end airport for nichtbefoerderung bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataNichtBefoerderungMock = {
      ...userDataMock,
      bereich: "nichtbefoerderung",
    };

    addDetailedReason(mockDoc, mockStruct, userDataNichtBefoerderungMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      `Die Nicht-Beförderung fand auf dem Flug von ${startAirportMock} nach ${endAirportMock} statt. Aufgrund der Nicht-Beförderung wurde der Anschlussflug verpasst.`,
      PDF_MARGIN_HORIZONTAL,
    );
  });
});
