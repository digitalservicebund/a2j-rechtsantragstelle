import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addRenunciantPersonAddress } from "../addRenunciantPersonAddress";

const userDataMock = {
  ausschlagendePersonStrasse: "Musterstraße",
  ausschlagendePersonHausnummer: "1",
  ausschlagendePersonPlz: "12345",
  ausschlagendePersonOrt: "Musterstadt",
} satisfies NachlassErbausschlagungAnfrageUserData;

describe("addRenunciantPersonAddress", () => {
  it("should add the renunciant person address to the document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addRenunciantPersonAddress(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Straße und Hausnummer: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstraße 1");
    expect(mockDoc.text).toHaveBeenCalledWith("Postleitzahl: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("12345");
    expect(mockDoc.text).toHaveBeenCalledWith("Ort: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Musterstadt");
  });

  it("should add additional address information if provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addRenunciantPersonAddress(mockDoc, {
      ...userDataMock,
      ausschlagendePersonZusatz: "c/o Max Mustermann",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Adresszusatz: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("c/o Max Mustermann");
  });
});
