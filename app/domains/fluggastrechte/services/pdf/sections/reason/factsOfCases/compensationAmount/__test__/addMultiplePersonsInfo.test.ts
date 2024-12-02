import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/fluggastrechte/services/pdf/__test__/userDataMock";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import {
  addMultiplePersonsInfo,
  ATTACHMENT_ASSIGNMENTS_TEXT,
  CLAIM_FOLLOWING_PERSONS_TRANSFERER_TEXT,
  EVIDENCE_QUESTION_WITNESSES_TEXT,
  INFORMATION_BOOKING_AND_ASSIGNMENTS_ANNULLIERUNG_TEXT,
  INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT,
} from "../addMultiplePersonsInfo";

describe("addMultiplePersonsInfo", () => {
  it("should not call any print text given an user data is not weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addMultiplePersonsInfo(mockDoc, userDataMock);

    expect(mockDoc.text).not.toBeCalled();
  });

  it("should not call any print text given an user data with empty weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.Values.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).not.toBeCalled();
  });

  it("should have the text for CLAIM_FOLLOWING_PERSONS_TRANSFERER_TEXT given an user data with weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith(
      CLAIM_FOLLOWING_PERSONS_TRANSFERER_TEXT,
    );
  });

  it("should have the text for persons names given an user data with weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith("Vorname nachname");
  });

  it("should have the text for ATTACHMENT_ASSIGNMENTS_TEXT given an user data with weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith(
      ATTACHMENT_ASSIGNMENTS_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT given an user data with weitere personen, zeugen yes and bereich verspaetet", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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
      hasZeugen: YesNoAnswer.Values.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith(
      INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT given an user data with weitere personen, zeugen yes and bereich nichtbefoerderung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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
      hasZeugen: YesNoAnswer.Values.yes,
      bereich: "nichtbefoerderung",
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith(
      INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for INFORMATION_BOOKING_AND_ASSIGNMENTS_ANNULLIERUNG_TEXT given an user data with weitere personen, zeugen yes and bereich annullierung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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
      hasZeugen: YesNoAnswer.Values.yes,
      bereich: "annullierung",
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith(
      INFORMATION_BOOKING_AND_ASSIGNMENTS_ANNULLIERUNG_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for EVIDENCE_QUESTION_WITNESSES_TEXT given an user data with weitere personen and zeugen yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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
      hasZeugen: YesNoAnswer.Values.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith(
      EVIDENCE_QUESTION_WITNESSES_TEXT,
      expect.anything(),
    );
  });

  it("should have call text for persons names given an user data with weitere personen and zeugen yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWeiterePersonen = {
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
      hasZeugen: YesNoAnswer.Values.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen);

    expect(mockDoc.text).toHaveBeenCalledWith("Vorname nachname");
  });
});
