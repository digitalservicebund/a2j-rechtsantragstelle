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

    addLegalRepresentation(mockDoc, mockStruct, userDataMock);

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

    addLegalRepresentation(mockDoc, mockStruct, userDataWithAnwaltschaft);

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

  it("should add legal representation phone number without email", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataWithoutEmail = {
      ...userDataMock,
      anwaltschaft: "yes" as const,
      klagendePersonAnwaltschaftEmail: undefined,
      klagendePersonAnwaltschaftTelefonnummer: "0123456789",
    };

    addLegalRepresentation(mockDoc, mockStruct, userDataWithoutEmail);

    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataWithoutEmail.klagendePersonAnwaltschaftTelefonnummer,
      {
        link: `tel:${userDataWithoutEmail.klagendePersonAnwaltschaftTelefonnummer}`,
        continued: false,
      },
    );
  });

  it("should add legal representation phone number and email when both are provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataWithEmail = {
      ...userDataMock,
      anwaltschaft: "yes" as const,
      klagendePersonAnwaltschaftEmail: "test@test.com.de",
      klagendePersonAnwaltschaftTelefonnummer: "0123456789",
    };

    addLegalRepresentation(mockDoc, mockStruct, userDataWithEmail);

    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataWithEmail.klagendePersonAnwaltschaftTelefonnummer,
      {
        link: `tel:${userDataWithEmail.klagendePersonAnwaltschaftTelefonnummer}`,
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(" | ", { continued: true });
    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataWithEmail.klagendePersonAnwaltschaftEmail,
      {
        link: `mailto:${userDataWithEmail.klagendePersonAnwaltschaftEmail}`,
      },
    );
  });

  it("should add legal representation email without phone number", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataWithEmail = {
      ...userDataMock,
      anwaltschaft: "yes" as const,
      klagendePersonAnwaltschaftEmail: "test@test.com.de",
      klagendePersonAnwaltschaftTelefonnummer: undefined,
    };

    addLegalRepresentation(mockDoc, mockStruct, userDataWithEmail);

    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataWithEmail.klagendePersonAnwaltschaftEmail,
      {
        link: `mailto:${userDataWithEmail.klagendePersonAnwaltschaftEmail}`,
      },
    );
  });
});
