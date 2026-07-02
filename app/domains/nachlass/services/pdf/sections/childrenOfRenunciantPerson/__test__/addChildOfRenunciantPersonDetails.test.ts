import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addChildOfRenunciantPersonDetails } from "../addChildOfRenunciantPersonDetails";
import { type NachlassErbausschlagungAnfrageKind } from "../createChildrenOfRenunciantPerson";

const childrenOfRenunciantPersonMock = {
  vorname: "Max",
  nachname: "Mustermann",
  wohnortBeiAntragsteller: "yes",
  geburtsdatum: { day: "01", month: "01", year: "2000" },
} satisfies NachlassErbausschlagungAnfrageKind;

describe("addChildOfRenunciantPersonDetails", () => {
  it("should add the details of the child of renunciant person to the pdf document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addChildOfRenunciantPersonDetails(mockDoc, mockStruct, {
      ...childrenOfRenunciantPersonMock,
      wohnortBeiAntragsteller: "yes",
    });

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
    expect(mockDoc.text).toHaveBeenCalledWith("01.01.2000");
  });
});
