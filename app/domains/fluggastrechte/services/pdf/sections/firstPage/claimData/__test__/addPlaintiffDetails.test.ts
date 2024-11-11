import { userDataMock } from "tests/factories/fluggastrechte/userDataMock";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../../createPdfKitDocument";
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
    expect(mockDoc.text).toHaveBeenCalledWith("Fr. Test-test Test", {
      continued: true,
    });
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(SEPARATOR, { continued: true });
    expect(mockDoc.text).toHaveBeenCalledWith(
      `${userDataMock.strasseHausnummer} ${userDataMock.plz} ${userDataMock.ort}`,
    );
    expect(mockDoc.text).toHaveBeenCalledWith(userDataMock.telefonnummer);
    expect(mockDoc.text).toHaveBeenCalledWith(PLAINTIFF_TEXT, {
      align: "left",
    });
  });
});