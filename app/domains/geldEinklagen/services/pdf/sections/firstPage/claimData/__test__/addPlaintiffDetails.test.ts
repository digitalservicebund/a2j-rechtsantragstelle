import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { userDataMock } from "~/domains/geldEinklagen/services/pdf/__test__/userDataMock";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import {
  addPlaintiffDetails,
  PLAINTIFF_TEXT,
  SEPARATOR,
} from "../addPlaintiffDetails";

describe("addPlaintiffDetails", () => {
  it("should create document with full plaintiff details", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    addPlaintiffDetails(mockDoc, mockStruct, userDataMock);

    expect(mockDoc.fontSize).toHaveBeenCalledWith(10);
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_BOLD);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Herr Klagendepersonvorname klagendePersonNachname",
      {
        continued: true,
      },
    );
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(SEPARATOR, { continued: true });
    expect(mockDoc.text).toHaveBeenCalledWith(
      `${userDataMock.klagendePersonStrasseHausnummer}, ${userDataMock.klagendePersonPlz} ${userDataMock.klagendePersonOrt}, Deutschland`,
    );

    expect(mockDoc.text).toHaveBeenCalledWith(PLAINTIFF_TEXT, {
      align: "left",
    });
  });

  it("should add plaintiff phone number without email", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataWithoutEmail = {
      ...userDataMock,
      klagendeEmail: undefined,
    };

    addPlaintiffDetails(mockDoc, mockStruct, userDataWithoutEmail);

    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataWithoutEmail.klagendeTelefonnummer,
      {
        link: `tel:${userDataWithoutEmail.klagendeTelefonnummer}`,
        continued: false,
      },
    );
  });

  it("should add plaintiff phone number and email when both are provided", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataWithEmail = {
      ...userDataMock,
      klagendeEmail: "test@test.com.de",
    };

    addPlaintiffDetails(mockDoc, mockStruct, userDataWithEmail);

    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataWithEmail.klagendeTelefonnummer,
      {
        link: `tel:${userDataWithEmail.klagendeTelefonnummer}`,
        continued: true,
      },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(SEPARATOR, { continued: true });
    expect(mockDoc.text).toHaveBeenCalledWith(userDataWithEmail.klagendeEmail, {
      link: `mailto:${userDataWithEmail.klagendeEmail}`,
    });
  });

  it("should add plaintiff email without phone number", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);
    const userDataWithEmail = {
      ...userDataMock,
      klagendeTelefonnummer: undefined,
      klagendeEmail: "test@test.com.de",
    };

    addPlaintiffDetails(mockDoc, mockStruct, userDataWithEmail);

    expect(mockDoc.text).toHaveBeenCalledWith(userDataWithEmail.klagendeEmail, {
      link: `mailto:${userDataWithEmail.klagendeEmail}`,
    });
  });
});
