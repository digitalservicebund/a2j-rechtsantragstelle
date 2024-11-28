import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  addDetailedReason,
  ATTACHMENT_CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT,
  ATTACHMENT_CONFIRM_BOOKING_TEXT,
  CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT,
  CONFIRM_BOOKING_TEXT,
  MARGIN_RIGHT,
  PLAINTIFF_ON_TIME_MULTIPLE_PERSONS_TEXT,
  PLAINTIFF_ON_TIME_TEXT,
} from "../addDetailedReason";
import { addFlightTextArea } from "../addFlightTextArea";
import { addMultiplePersonsText } from "../addMultiplePersonsText";

vi.mock("../addFlightTextArea");
vi.mock("../addMultiplePersonsText");

vi.mocked(addFlightTextArea).mockImplementation(() => vi.fn());
vi.mocked(addMultiplePersonsText).mockImplementation(() => vi.fn());

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
      ATTACHMENT_CONFIRM_BOOKING_MULTIPLE_PERSONS_TEXT,
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

  it("should call function addMultiplePersonsText", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDetailedReason(mockDoc, mockStruct, userDataMock);

    expect(addMultiplePersonsText).toBeCalled();
  });

  it("should call function addFlightTextArea", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDetailedReason(mockDoc, mockStruct, userDataMock);

    expect(addFlightTextArea).toBeCalled();
  });
});
