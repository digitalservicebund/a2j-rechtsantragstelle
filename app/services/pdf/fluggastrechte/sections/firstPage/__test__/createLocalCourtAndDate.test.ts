import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  createLocalCourtAndDate,
  CREATION_DATE_PDF_TEXT,
  TO_THE_COURT_TEXT,
} from "../createLocalCourtAndDate";

describe("createLocalCourtAndDate", () => {
  it("should create the document with the local court and date", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    createLocalCourtAndDate(mockDoc, mockStruct);

    expect(mockDoc.struct).toHaveBeenCalledWith("Sect");
    expect(mockDoc.struct).toHaveBeenCalledWith("P", {}, expect.any(Function));

    expect(mockDoc.text).toHaveBeenCalledWith(CREATION_DATE_PDF_TEXT, {
      align: "right",
    });
    expect(mockDoc.text).toHaveBeenCalledWith(TO_THE_COURT_TEXT, {
      align: "left",
    });
  });
});
