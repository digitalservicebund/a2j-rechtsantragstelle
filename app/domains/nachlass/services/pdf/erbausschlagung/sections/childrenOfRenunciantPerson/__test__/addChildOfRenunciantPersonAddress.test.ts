import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addChildOfRenunciantPersonAddress } from "../addChildOfRenunciantPersonAddress";
import { type NachlassErbausschlagungAnfrageKind } from "../createChildrenOfRenunciantPerson";

const childrenOfRenunciantPersonMock = {
  adresseZusatz: "c/o Max Mustermann",
  strasse: "Musterstraße",
  vorname: "Max",
  nachname: "Mustermann",
  geburtsdatum: {
    day: "01",
    month: "01",
    year: "2020",
  },
  hausnummer: "1",
  plz: "12345",
  ort: "Musterstadt",
  wohnortBeiAntragsteller: "no",
} satisfies NachlassErbausschlagungAnfrageKind;

describe("addChildOfRenunciantPersonAddress", () => {
  it("should add the text same address as the parent of the child of renunciant person to the pdf document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonAddress(mockDoc, mockStruct, {
      ...childrenOfRenunciantPersonMock,
      wohnortBeiAntragsteller: "yes",
    });

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Wohnt zusammen mit der ausschlagenden Person",
    );
  });

  it("should add address of the child of renunciant person to the pdf document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonAddress(
      mockDoc,
      mockStruct,
      childrenOfRenunciantPersonMock,
    );

    expect(mockDoc.text).toHaveBeenCalledWith("Anschrift:");
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("12345 Musterstadt");
    expect(mockDoc.text).toHaveBeenCalledWith("c/o Max Mustermann");
  });
});
