import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { YesNoAnswer } from "~/services/validation/YesNoAnswer";
import { addMultiplePersonsText } from "../addMultiplePersonsText";

describe("addMultiplePersonsText", () => {
  it("should not have any text if given no weitere personen", () => {
    const userDataNoMultiplePersons = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.enum.no,
    };

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addMultiplePersonsText(mockDoc, userDataNoMultiplePersons);

    expect(mockDoc.text).not.toBeCalled();
  });

  it("should not have any text if given yes weitere personen and empty array", () => {
    const userDataNoMultiplePersons = {
      ...userDataMock,
      isWeiterePersonen: YesNoAnswer.enum.yes,
      weiterePersonen: [],
    };

    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addMultiplePersonsText(mockDoc, userDataNoMultiplePersons);

    expect(mockDoc.text).not.toBeCalled();
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

    addMultiplePersonsText(mockDoc, userDataWeiterePersonenMock);

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

    addMultiplePersonsText(mockDoc, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Folgende Personen waren von dieser Annullierung betroffen:",
      PDF_MARGIN_HORIZONTAL,
    );
  });

  it("should have the text for following persons given weiter personen and nichtbefoerderung bereich", () => {
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
      bereich: "nichtbefoerderung",
      isWeiterePersonen: YesNoAnswer.Values.yes,
    };

    addMultiplePersonsText(mockDoc, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Folgende Personen waren von dieser Nicht-Beförderung betroffen:",
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

    addMultiplePersonsText(mockDoc, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "1. ",
      expect.anything(),
      undefined,
      expect.anything(),
    );

    expect(mockDoc.text).toHaveBeenCalledWith("Die klagende Partei Test Test");
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
          telefonnummer: "telefonnummer",
        },
        {
          vorname: "vorname2",
          nachname: "nachname2",
          strasseHausnummer: "strasseHausnummer",
          ort: "ort",
          plz: "plz",
          buchungsnummer: "123456",
        },
        {
          vorname: "vorname3",
          nachname: "nachname3",
          strasseHausnummer: "strasseHausnummer",
          ort: "ort",
          plz: "plz",
        },
      ],
      isWeiterePersonen: YesNoAnswer.Values.yes,
    };

    addMultiplePersonsText(mockDoc, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith("2. ", expect.anything());

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Vorname nachname, strasseHausnummer, plz ort, Telefonnummer telefonnummer",
    );

    expect(mockDoc.text).toHaveBeenCalledWith("3. ", expect.anything());

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Vorname2 nachname2, strasseHausnummer, plz ort, abweichende Buchungsnummer: 123456",
    );

    expect(mockDoc.text).toHaveBeenCalledWith("4. ", expect.anything());

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Vorname3 nachname3, strasseHausnummer, plz ort",
    );
  });
});
