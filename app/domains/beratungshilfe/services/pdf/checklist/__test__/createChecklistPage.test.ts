import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { abgabeContext } from "~/domains/shared/formular/abgabe/context";
import { createChecklistPage } from "../createChecklistPage";

describe("createChecklistPage", () => {
  it("should create checklist page for 'ausdrucken' abgabeArt", () => {
    const mockDocumentStruct = mockPdfKitDocumentStructure();
    const mockPDFDocument = mockPdfKitDocument(mockDocumentStruct);
    const userData: BeratungshilfeFormularContext = {
      vorname: "Luca",
      nachname: "Mustermensch",
      abgabeArt: abgabeContext.abgabeArt.Enum.ausdrucken,
    };
    createChecklistPage(mockPDFDocument, mockDocumentStruct, userData);

    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      1,
      "Merkblatt: Antrag auf Bewilligung von Beratungshilfe von Luca Mustermensch",
    );
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(2, "Anhang");
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      3,
      "So schicken Sie den Antrag ins Amtsgericht",
    );
  });

  it("should create checklist page for 'online' abgabeArt", () => {
    const mockDocumentStruct = mockPdfKitDocumentStructure();
    const mockPDFDocument = mockPdfKitDocument(mockDocumentStruct);
    const userData: BeratungshilfeFormularContext = {
      vorname: "Luca",
      nachname: "Mustermensch",
      abgabeArt: abgabeContext.abgabeArt.Enum.online,
    };
    createChecklistPage(mockPDFDocument, mockDocumentStruct, userData);

    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      1,
      "Merkblatt: Antrag auf Bewilligung von Beratungshilfe von Luca Mustermensch",
    );
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(2, "Anhang");
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      3,
      "So stellen Sie den Antrag online",
    );
  });
});
