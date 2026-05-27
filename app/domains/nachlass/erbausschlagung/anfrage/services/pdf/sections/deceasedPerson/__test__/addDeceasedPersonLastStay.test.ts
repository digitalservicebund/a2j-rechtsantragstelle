import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addDeceasedPersonLastStay } from "../addDeceasedPersonLastStay";

const userDataMock = {
  livedInNursingHome: "yes",
  verstorbeneLebensmittelpunkt: "deutschland",
  verstorbeneAdresseStrasse: "Musterstraße",
  verstorbeneAdresseHausnummer: "1",
  plzBeforeHospiz: "12345",
  verstorbeneAdresseOrt: "Musterstadt",
} satisfies NachlassErbausschlagungAnfrageUserData;

describe("addDeceasedPersonLastStay", () => {
  it("should last residence title", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Letzter gewöhnlicher Aufenthalt",
    );
  });

  it("should add nursing home stay information", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Aufenthaltsort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Pflegeheim");
  });

  it("should not add nursing home stay information", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, {
      ...userDataMock,
      livedInNursingHome: "no",
    });

    expect(mockDoc.text).not.toHaveBeenCalledWith("Aufenthaltsort: ", {
      continued: true,
    });
    expect(mockDoc.text).not.toHaveBeenCalledWith("Pflegeheim");
  });

  it("should add address information for Germany", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift:");
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Musterstadt");
    expect(mockDoc.text).toHaveBeenCalledWith("Deutschland");
  });

  it("should add address information for abroad", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneLebensmittelpunkt: "ausland",
      verstorbeneAuslaendischeAdresseStrasse: "Österreichstraße",
      verstorbeneAuslaendischeAdresseHausnummer: "1",
      verstorbeneAuslaendischeAdresseOrt: "Wien",
      verstorbeneAuslaendischeAdressePLZ: "54321",
      verstorbeneAuslaendischeAdresseLand: "Österreich",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift:");
    expect(mockDoc.text).toHaveBeenCalledWith("Österreichstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("54321 Wien");
    expect(mockDoc.text).toHaveBeenCalledWith("Österreich");
  });

  it("should add zip code plzPflegeheim when plzBeforeHospiz is not provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, {
      ...userDataMock,
      plzBeforeHospiz: undefined,
      plzPflegeheim: "54321",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("54321 Musterstadt");
  });

  it("should add zip code plzVerstorbene when plzBeforeHospiz is not provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, {
      ...userDataMock,
      plzBeforeHospiz: undefined,
      plzVerstorbene: "54322",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("54322 Musterstadt");
  });
});
