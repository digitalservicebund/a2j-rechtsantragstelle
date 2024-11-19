import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  addReason,
  ARTICLE_DELAY_CANCEL_TEXT,
  ARTICLE_NOT_MOVE_TEXT,
  CANCEL_TEXT,
  DELAY_TEXT,
  NOT_MOVE_TEXT,
  PASSIVE_VERB_TEXT,
  PLAINTIFF_BOOKED_MULTIPLE_PERSONS_TEXT,
  PLAINTIFF_BOOKED_TEXT,
} from "../addReason";

describe("addReason", () => {
  it("should render document with PLAINTIFF_BOOKED_TEXT", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addReason(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(PLAINTIFF_BOOKED_TEXT, {
      continued: true,
    });
  });

  it("should render document with PLAINTIFF_BOOKED_MULTIPLE_PERSONS_TEXT in case is multiple persons", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataMultiplePersonsMock = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.enum.yes,
    };

    addReason(mockDoc, mockStruct, userDataMultiplePersonsMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      PLAINTIFF_BOOKED_MULTIPLE_PERSONS_TEXT,
      {
        continued: true,
      },
    );
  });

  it("should render document for verspaetet claim", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addReason(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(ARTICLE_DELAY_CANCEL_TEXT, {
      continued: true,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(DELAY_TEXT, {
      continued: true,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(PASSIVE_VERB_TEXT);
  });

  it("should render document for annullierung claim", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataAnnullierungMock = {
      ...userDataMock,
      bereich: "annullierung",
    };

    addReason(mockDoc, mockStruct, userDataAnnullierungMock);

    expect(mockDoc.text).toHaveBeenCalledWith(ARTICLE_DELAY_CANCEL_TEXT, {
      continued: true,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(CANCEL_TEXT, {
      continued: true,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(PASSIVE_VERB_TEXT);
  });

  it("should render document for nichtbefoerderung claim", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataNichtBefoerderungMock = {
      ...userDataMock,
      bereich: "nichtbefoerderung",
    };

    addReason(mockDoc, mockStruct, userDataNichtBefoerderungMock);

    expect(mockDoc.text).toHaveBeenCalledWith(ARTICLE_NOT_MOVE_TEXT, {
      continued: true,
    });

    expect(mockDoc.text).toHaveBeenCalledWith(NOT_MOVE_TEXT, {
      continued: true,
    });

    expect(mockDoc.text).not.toHaveBeenCalledWith(PASSIVE_VERB_TEXT);
  });
});
