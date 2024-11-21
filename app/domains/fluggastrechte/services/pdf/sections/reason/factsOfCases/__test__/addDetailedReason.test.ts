import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { getAirportNameByIataCode } from "~/domains/fluggastrechte/services/airports/getAirportNameByIataCode";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  addDetailedReason,
  ATTACHMENT_CONFIRM_BOOKING_TEXT,
  CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT,
  CONFIRM_BOOKING_TEXT,
  MARGIN_RIGHT,
  PLAINTIFF_ON_TIME_MULTIPLE_PERSONS_TEXT,
  PLAINTIFF_ON_TIME_TEXT,
} from "../addDetailedReason";

vi.mock("~/domains/fluggastrechte/services/airports/getAirportNameByIataCode");

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

  it("should have the text for booking confirm and attachment booking confirm for multiple persons", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataMultiplePersons = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.enum.yes,
    };

    addDetailedReason(mockDoc, mockStruct, userDataMultiplePersons);

    expect(mockDoc.text).toHaveBeenCalledWith(
      CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT,
    );

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

  it("should have the text for plaintiff on time for verspaetet bereich for multiple persons", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataMultiplePersons = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.enum.yes,
    };

    addDetailedReason(mockDoc, mockStruct, userDataMultiplePersons);

    expect(mockDoc.text).toHaveBeenCalledWith(
      PLAINTIFF_ON_TIME_MULTIPLE_PERSONS_TEXT,
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

  it("should have the text for plaintiff on time for nichtbefoerderung bereich for multiple persons", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataNichtBefoerderungMock = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.enum.yes,
      bereich: "nichtbefoerderung",
    };

    addDetailedReason(mockDoc, mockStruct, userDataNichtBefoerderungMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      PLAINTIFF_ON_TIME_MULTIPLE_PERSONS_TEXT,
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

  it("should have the text for following persons given weiter personen and verspaetet bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      weiterePersonen: [
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          ort: "ort",
          plz: "plz",
        },
      ],
      isWeiterePersonen: YesNoAnswer.Values.yes,
    };

    addDetailedReason(mockDoc, mockStruct, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Folgende Personen waren von dieser Verspätung betroffen:",
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for following persons given weiter personen and annullierung bereich", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      weiterePersonen: [
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          ort: "ort",
          plz: "plz",
        },
      ],
      bereich: "annullierung",
      isWeiterePersonen: YesNoAnswer.Values.yes,
    };

    addDetailedReason(mockDoc, mockStruct, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Folgende Personen waren von dieser Annullierung betroffen:",
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for plaintiff name given weiter personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      anrede: undefined,
      title: undefined,
      vorname: "Test",
      nachname: "Test",
      weiterePersonen: [
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          ort: "ort",
          plz: "plz",
        },
      ],
      isWeiterePersonen: YesNoAnswer.Values.yes,
    };

    addDetailedReason(mockDoc, mockStruct, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "1. Die klagende Partei Test Test",
      expect.anything(),
    );
  });

  it("should have the text for persons names  given weiter personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonenMock = {
      ...userDataMock,
      anrede: undefined,
      title: undefined,
      vorname: "Test",
      nachname: "Test",
      weiterePersonen: [
        {
          vorname: "vorname",
          nachname: "nachname",
          strasseHausnummer: "strasseHausnummer",
          ort: "ort",
          plz: "plz",
        },
        {
          vorname: "vorname2",
          nachname: "nachname2",
          strasseHausnummer: "strasseHausnummer",
          ort: "ort",
          plz: "plz",
          buchungsnummer: "123456",
        },
      ],
      isWeiterePersonen: YesNoAnswer.Values.yes,
    };

    addDetailedReason(mockDoc, mockStruct, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "2. Vorname nachname, strasseHausnummer, plz, ort",
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      "3. Vorname2 nachname2, strasseHausnummer, plz, ort, abweichende Buchungsnummer: 123456",
    );
  });
});
