import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { getAirportNameByIataCode } from "~/services/airports/getAirportNameByIataCode";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/fluggastrechte/createPdfKitDocument";
import { MARGIN_RIGHT } from "../addDetailedReason";
import {
  addFlightDetails,
  BOOKING_NUMBER_TEXT,
  END_AIRPORT_TEXT,
  FIRST_AIRPORT_STOP_TEXT,
  FLIGHT_NUMBER_TEXT,
  PLANNED_DEPARTURE_DATE_TEXT,
  SECOND_AIRPORT_STOP_TEXT,
  START_AIRPORT_TEXT,
  THIRD_AIRPORT_STOP_TEXT,
} from "../addFlightDetails";

afterEach(() => {
  vi.resetAllMocks();
});

vi.mock("~/services/airports/getAirportNameByIataCode");

describe("addFlightDetails", () => {
  it("should add the booking number to the pdf document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFlightDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      BOOKING_NUMBER_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.buchungsNummer);
  });

  it("should add the flight number to the pdf document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFlightDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      FLIGHT_NUMBER_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.direktFlugnummer);
  });

  it("should add the planned departure date to the pdf document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFlightDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      PLANNED_DEPARTURE_DATE_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.direktAbflugsDatum);
  });

  it("should add the start and end airport to the pdf document", () => {
    const startAirportMock = "BERLIN";
    const endAirportMock = "NEW YORK";
    vi.mocked(getAirportNameByIataCode).mockImplementation((airport) => {
      if (airport === "BER") {
        return startAirportMock;
      }

      return endAirportMock;
    });

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFlightDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      START_AIRPORT_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(startAirportMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      END_AIRPORT_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(endAirportMock);
  });

  it("should add the zwischenstopp 1 to the pdf document", () => {
    const zwischenstopp1Mock = "ZWISCHENSTOPP1";
    const zwischenstopp1TextMock = "ZWISCHENSTOPP1";
    vi.mocked(getAirportNameByIataCode).mockImplementation((airport) => {
      if (airport === zwischenstopp1Mock) {
        return zwischenstopp1TextMock;
      }

      return "";
    });
    const userDataZwischenstopp1Mock = {
      ...userDataMock,
      ersterZwischenstopp: zwischenstopp1Mock,
    };

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFlightDetails(mockDoc, mockStruct, userDataZwischenstopp1Mock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      FIRST_AIRPORT_STOP_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(zwischenstopp1TextMock);
  });

  it("should add the zwischenstopp 2 to the pdf document", () => {
    const zwischenstopp2Mock = "ZWISCHENSTOPP2";
    const zwischenstopp2TextMock = "ZWISCHENSTOPP2";
    vi.mocked(getAirportNameByIataCode).mockImplementation((airport) => {
      if (airport === zwischenstopp2Mock) {
        return zwischenstopp2TextMock;
      }

      return "";
    });
    const userDataZwischenstopp2Mock = {
      ...userDataMock,
      zweiterZwischenstopp: zwischenstopp2Mock,
    };

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFlightDetails(mockDoc, mockStruct, userDataZwischenstopp2Mock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      SECOND_AIRPORT_STOP_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(zwischenstopp2TextMock);
  });

  it("should add the zwischenstopp 3 to the pdf document", () => {
    const zwischenstopp3Mock = "ZWISCHENSTOPP3";
    const zwischenstopp3TextMock = "ZWISCHENSTOPP3";
    vi.mocked(getAirportNameByIataCode).mockImplementation((airport) => {
      if (airport === zwischenstopp3Mock) {
        return zwischenstopp3TextMock;
      }

      return "";
    });
    const userDataZwischenstopp3Mock = {
      ...userDataMock,
      dritterZwischenstopp: zwischenstopp3Mock,
    };

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addFlightDetails(mockDoc, mockStruct, userDataZwischenstopp3Mock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      THIRD_AIRPORT_STOP_TEXT,
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(zwischenstopp3TextMock);
  });
});
