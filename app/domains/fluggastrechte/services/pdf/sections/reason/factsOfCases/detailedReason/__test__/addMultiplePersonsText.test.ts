import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
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

    addMultiplePersonsText(mockDoc, userDataWeiterePersonenMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "2. Vorname nachname, strasseHausnummer, plz ort",
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      "3. Vorname2 nachname2, strasseHausnummer, plz ort, abweichende Buchungsnummer: 123456",
    );
  });
});
