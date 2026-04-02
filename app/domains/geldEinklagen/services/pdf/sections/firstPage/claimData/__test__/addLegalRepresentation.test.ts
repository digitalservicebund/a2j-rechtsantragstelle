import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addLegalRepresentation } from "../addLegalRepresentation";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

describe("addLegalRepresentation", () => {
  it("should not add legal representation if anwaltschaft is 'no'", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addLegalRepresentation(mockDoc, userDataMock);

    expect(mockDoc.text).not.toHaveBeenCalled();
  });

  it("should add legal representation if anwaltschaft is 'yes'", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const userDataWithAnwaltschaft: GeldEinklagenFormularUserData = {
      ...userDataMock,
      anwaltschaft: "yes",
      klagendePersonAnwaltschaftKanzlei: "Musterkanzlei",
      klagendePersonAnwaltschaftAnrede: "herr",
      klagendePersonAnwaltschaftNachname: "Mustermann",
      klagendePersonAnwaltschaftTitle: "Dr.",
      klagendePersonAnwaltschaftVorname: "Max",
      klagendePersonAnwaltschaftStrasseHausnummer: "Musterstraße 1",
      klagendePersonAnwaltschaftPlz: "12345",
      klagendePersonAnwaltschaftOrt: "Musterstadt",
      klagendePersonAnwaltschaftGeschaeftszeichen: "123/456/789",
    };

    addLegalRepresentation(mockDoc, userDataWithAnwaltschaft);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Musterkanzlei, Herr Dr. Max Mustermann",
      {
        continued: true,
      },
    );

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Musterstraße 1, 12345 Musterstadt, Deutschland",
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Geschäftszeichen: 123/456/789");
  });
});
