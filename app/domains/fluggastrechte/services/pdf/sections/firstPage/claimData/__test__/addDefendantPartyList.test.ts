import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList, MARGIN_RIGHT } from "../addDefendantPartyList";

describe("addDefendantPartyList", () => {
  it("should create document with defendant party list when litigation interest is requested", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDefendantPartyList(mockDoc, "yes", 600);

    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_BOLD);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "1. ",
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      { continued: true },
    );
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die beklagte Partei wird verurteilt, an die klagende Partei 600 € nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit zu zahlen.",
      { width: 500 },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "2. ",
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      { continued: true },
    );
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die beklagte Partei trägt die Kosten des Rechtsstreits.",
      { width: 500 },
    );
  });

  it("should create document with defendant party list when litigation interest is not requested", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDefendantPartyList(mockDoc, "no", 600);

    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_BOLD);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "1. ",
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      { continued: true },
    );
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die beklagte Partei wird verurteilt, an die klagende Partei 600 € zu zahlen.",
      { width: 500 },
    );
    expect(mockDoc.text).toHaveBeenCalledWith(
      "2. ",
      PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT,
      undefined,
      { continued: true },
    );
    expect(mockDoc.font).toHaveBeenCalledWith(FONTS_BUNDESSANS_REGULAR);
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Die beklagte Partei trägt die Kosten des Rechtsstreits.",
      { width: 500 },
    );
  });
});
