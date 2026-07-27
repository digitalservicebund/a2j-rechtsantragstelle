import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addDeceasedPersonLastStay } from "../addDeceasedPersonLastStay";
import { type NachlassErbscheinAnfrageUserData } from "~/domains/nachlass/erbschein/anfrage/userData";

const userDataMock = {
  verstorbeneLivedInPflegeheim: "no",
  verstorbeneLebensmittelpunkt: "deutschland",
  verstorbenePersonStrasse: "Musterstraße",
  verstorbenePersonHausnummer: "1",
  verstorbenePlz: "12345",
  verstorbenePersonOrt: "Musterstadt",
} satisfies NachlassErbscheinAnfrageUserData;

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

    addDeceasedPersonLastStay(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneLivedInPflegeheim: "yes",
    });

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
      verstorbeneLivedInPflegeheim: "no",
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
      verstorbenePersonAuslaendischeStrasse: "Österreichstraße",
      verstorbenePersonAuslaendischeHausnummer: "1",
      verstorbenePersonAuslaendischerOrt: "Wien",
      verstorbenePersonLand: "Österreich",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift:");
    expect(mockDoc.text).toHaveBeenCalledWith("Österreichstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("Wien");
    expect(mockDoc.text).toHaveBeenCalledWith("Österreich");
  });

  it("should add zip code plzPflegeheim when the verstorbene person lived in a Pflegeheim", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneLivedInPflegeheim: "yes",
      verstorbenePflegeheimPlz: "54321",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("54321 Musterstadt");
  });

  it("should add zip code verstorbenePlz when the verstorbene person did not live in a Pflegeheim or Hospiz", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDeceasedPersonLastStay(mockDoc, mockStruct, {
      ...userDataMock,
      verstorbeneLivedInPflegeheim: "no",
      verstorbeneLivedInHospiz: "no",
      verstorbenePlz: "54322",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("54322 Musterstadt");
  });
});
