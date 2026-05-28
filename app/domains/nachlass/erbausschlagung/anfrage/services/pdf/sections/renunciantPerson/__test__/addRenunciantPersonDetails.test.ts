import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addRenunciantPersonDetails } from "../addRenunciantPersonDetails";

const userDataMock = {
  ausschlagendePersonVorname: "Max",
  ausschlagendePersonNachname: "Mustermann",
  ausschlagendePersonGeburtsdatum: { day: "01", month: "01", year: "1990" },
} satisfies NachlassErbausschlagungAnfrageUserData;

describe("addRenunciantPersonDetails", () => {
  it("should add the renunciant person details to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addRenunciantPersonDetails(mockDoc, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Vornamen: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Max");
    expect(mockDoc.text).toHaveBeenCalledWith("Nachname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Mustermann");
    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsdatum: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.1990");
  });

  it("should add birth name if it provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addRenunciantPersonDetails(mockDoc, {
      ...userDataMock,
      ausschlagendePersonGeburtsname: "Musterfrau",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("Geburtsname: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("Musterfrau");
  });
});
