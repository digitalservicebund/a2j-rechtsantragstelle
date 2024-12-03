import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { MARGIN_RIGHT } from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "../addDefendantPartyList";

describe("addDefendantPartyList", () => {
  it("should create document with defendant party list when litigation interest is requested", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDefendantPartyList(mockDoc, mockStruct, "yes", 600);

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
    );
  });

  it("should create document with defendant party list when litigation interest is not requested", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDefendantPartyList(mockDoc, mockStruct, "no", 600);

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
    );
  });
});
