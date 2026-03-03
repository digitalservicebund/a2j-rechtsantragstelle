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
    addPlaintiffDetails(mockDoc, userDataMock);

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
    expect(mockDoc.text).toHaveBeenCalledWith(
      userDataMock.klagendeTelefonnummer,
    );
    expect(mockDoc.text).toHaveBeenCalledWith(PLAINTIFF_TEXT, {
      align: "left",
    });
  });
});
