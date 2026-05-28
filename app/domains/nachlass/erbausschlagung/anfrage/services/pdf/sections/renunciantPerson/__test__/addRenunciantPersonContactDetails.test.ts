import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { type NachlassErbausschlagungAnfrageUserData } from "~/domains/nachlass/erbausschlagung/anfrage/userData";
import { addRenunciantPersonContactDetails } from "../addRenunciantPersonContactDetails";

const userDataMock = {
  ausschlagendePersonTelefon: "0123456789",
  ausschlagendePersonEmail: "max.mustermann@example.com",
} satisfies NachlassErbausschlagungAnfrageUserData;

describe("addRenunciantPersonContactDetails", () => {
  it("should add the renunciant person contact details to the PDF document", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addRenunciantPersonContactDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.text).toHaveBeenCalledWith("Telefonnummer: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("0123456789", {
      link: "tel:0123456789",
    });

    expect(mockDoc.text).toHaveBeenCalledWith("E-Mail: ", {
      continued: true,
    });
    expect(mockDoc.text).toHaveBeenCalledWith("max.mustermann@example.com", {
      link: "mailto:max.mustermann@example.com",
    });
  });
});
