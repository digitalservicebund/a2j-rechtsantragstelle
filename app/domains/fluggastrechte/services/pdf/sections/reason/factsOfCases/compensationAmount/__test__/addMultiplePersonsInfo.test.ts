import { type Mock } from "vitest";
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
    const mockSect = mockDoc.struct("Sect");

    addMultiplePersonsInfo(mockDoc, userDataMock, mockSect);

    expect(mockDoc.text).not.toBeCalled();
    // Added to silence ESLint warning: "Add at least one assertion to this test case.eslintsonarjs/assertions-in-tests"
    expect(mockDoc.text).toBeDefined();
  });

  it("should not call any print text given an user data with empty weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

    const userDataWeiterePersonen = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).not.toBeCalled();
    // Added to silence ESLint warning: "Add at least one assertion to this test case.eslintsonarjs/assertions-in-tests"
    expect(mockDoc.text).toBeDefined();
  });

  it("should have the text for CLAIM_FOLLOWING_PERSONS_TRANSFERER_TEXT given an user data with weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      CLAIM_FOLLOWING_PERSONS_TRANSFERER_TEXT,
    );
  });

  it("should have the text for persons names given an user data with weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith("Vorname nachname");
  });

  it("should have the text for ATTACHMENT_ASSIGNMENTS_TEXT given an user data with weitere personen", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      ATTACHMENT_ASSIGNMENTS_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT given an user data with weitere personen, zeugen yes and bereich verspaetet", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
      hasZeugen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT given an user data with weitere personen, zeugen yes and bereich nichtbefoerderung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
      hasZeugen: YesNoAnswer.enum.yes,
      bereich: "nichtbefoerderung",
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      INFORMATION_BOOKING_AND_ASSIGNMENTS_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for INFORMATION_BOOKING_AND_ASSIGNMENTS_ANNULLIERUNG_TEXT given an user data with weitere personen, zeugen yes and bereich annullierung", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
      hasZeugen: YesNoAnswer.enum.yes,
      bereich: "annullierung",
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      INFORMATION_BOOKING_AND_ASSIGNMENTS_ANNULLIERUNG_TEXT,
      expect.anything(),
    );
  });

  it("should have the text for EVIDENCE_QUESTION_WITNESSES_TEXT given an user data with weitere personen and zeugen yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
      hasZeugen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith(
      EVIDENCE_QUESTION_WITNESSES_TEXT,
      expect.anything(),
    );
  });

  it("should have call text for persons names given an user data with weitere personen and zeugen yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
      hasZeugen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);

    expect(mockDoc.text).toHaveBeenCalledWith("Vorname nachname");
  });
});

describe("addMultiplePersonsInfo - accessibility", () => {
  it("should call addMultiplePersonsInfo with two paragraphs if isWeiterePersonen is yes and hasZeugen is yes", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
      hasZeugen: YesNoAnswer.enum.yes,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(2);
  });

  it("should call addMultiplePersonsInfo with one paragraph if isWeiterePersonen is yes and hasZeugen is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.yes,
      hasZeugen: YesNoAnswer.enum.no,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));
    const callsWithP = (mockDoc.struct as Mock).mock.calls.filter(
      ([tag]) => tag === "P",
    );
    expect(callsWithP).toHaveLength(1);
  });

  it("should call addMultiplePersonsInfo without any paragraphs if isWeiterePersonen is no", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const mockSect = mockDoc.struct("Sect");

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
      isWeiterePersonen: YesNoAnswer.enum.no,
    };

    addMultiplePersonsInfo(mockDoc, userDataWeiterePersonen, mockSect);
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
