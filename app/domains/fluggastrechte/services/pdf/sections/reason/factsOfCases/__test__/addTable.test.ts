import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "../../../../createPdfKitDocument";
import { addTableInfo } from "../table/addTableInfo";

describe("addTableInfo", () => {
  it("should add a section with a paragraph containing the specified description", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const andereErsatzverbindungBeschreibung = "Sample description";
    const tableEndYPosition = 100;

    addTableInfo(
      mockDoc,
      mockStruct,
      andereErsatzverbindungBeschreibung,
      tableEndYPosition,
    );

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");

    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.fontSize).toHaveBeenCalledWith(10);
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(
      andereErsatzverbindungBeschreibung,
      PDF_MARGIN_HORIZONTAL,
      100,
    );
  });
});
