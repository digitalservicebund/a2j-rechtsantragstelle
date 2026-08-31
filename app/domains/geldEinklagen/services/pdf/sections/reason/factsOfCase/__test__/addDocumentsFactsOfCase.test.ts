import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import { addDocumentsFactsOfCase } from "../addDocumentsFactsOfCase";
import { type GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

describe("addDocumentsFactsOfCase", () => {
  it("should not add any documents if there are no documents in the user data", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    addDocumentsFactsOfCase(mockDoc, mockStruct, [], 0);

    expect(mockDoc.text).not.toHaveBeenCalled();
  });

  it("should add documents to the PDF document if there are documents in the user data", () => {
    const mockStruct = mockPdfKitDocumentStructure();
    const mockDoc = mockPdfKitDocument(mockStruct);

    const dokumenten: Exclude<
      GeldEinklagenFormularUserData["abschnitte"],
      undefined
    >[number]["dokumenten"] = [
      { beschreibung: "Dokument 1" },
      { beschreibung: "Dokument 2" },
    ];

    addDocumentsFactsOfCase(mockDoc, mockStruct, dokumenten, 0);

    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beweis K1: ",
      expect.any(Number),
      undefined,
      { continued: true },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Dokument 1");
    expect(mockDoc.text).toHaveBeenCalledWith(
      "Beweis K2: ",
      expect.any(Number),
      undefined,
      { continued: true },
    );
    expect(mockDoc.text).toHaveBeenCalledWith("Dokument 2");
  });
});
