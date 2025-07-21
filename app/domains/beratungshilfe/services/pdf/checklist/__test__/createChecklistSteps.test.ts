import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { abgabeInputSchema } from "~/domains/shared/formular/abgabe/userData";
import { createChecklistSteps } from "../createChecklistSteps";

describe("createChecklistSteps", () => {
  const mockDocumentStruct = mockPdfKitDocumentStructure();
  const mockPDFDocument = mockPdfKitDocument(mockDocumentStruct);
  mockPDFDocument.x = 0;
  mockPDFDocument.y = 0;

  it("should create checklist steps for 'ausdrucken' abgabeArt", () => {
    const userData: BeratungshilfeFormularUserData = {
      abgabeArt: abgabeInputSchema.abgabeArt.Enum.ausdrucken,
    };
    createChecklistSteps(mockPDFDocument, mockDocumentStruct, userData);

    expect(mockPDFDocument.text).toHaveBeenCalledWith("1. Antrag ausdrucken");
    expect(mockPDFDocument.text).toHaveBeenCalledWith(
      "2. Antrag unterschreiben",
    );
    expect(mockPDFDocument.text).toHaveBeenCalledWith(
      "3. Benötigte Dokumente kopieren",
    );
    expect(mockPDFDocument.text).toHaveBeenCalledWith("4. Antrag abgeben");
    expect(mockPDFDocument.list).toHaveBeenCalledWith(
      ["Unterlagen zu Ihrem rechtlichen Problem"],
      expect.any(Number),
      expect.any(Number),
      expect.any(Object),
    );
  });

  it("should create checklist steps for 'online' abgabeArt", () => {
    const onlineUserData: BeratungshilfeFormularUserData = {
      abgabeArt: abgabeInputSchema.abgabeArt.Enum.online,
    };

    createChecklistSteps(mockPDFDocument, mockDocumentStruct, onlineUserData);

    expect(mockPDFDocument.text).toHaveBeenCalledWith(
      "1. Antrag prüfen und speichern",
    );
    expect(mockPDFDocument.text).toHaveBeenCalledWith(
      "2. Benötigte Dokumente scannen",
    );
    expect(mockPDFDocument.text).toHaveBeenCalledWith(
      "3. Antrag über das Portal Mein Justizpostfach versenden",
    );
    expect(mockPDFDocument.list).toHaveBeenCalledWith(
      ["Unterlagen zu Ihrem rechtlichen Problem"],
      expect.any(Number),
      expect.any(Number),
      expect.any(Object),
    );
  });

  it("should include relevant documents based on user data conditions", () => {
    const customUserData: BeratungshilfeFormularUserData = {
      abgabeArt: abgabeInputSchema.abgabeArt.Enum.ausdrucken,
      staatlicheLeistungen: "buergergeld",
      hasGeldanlage: "yes",
      geldanlagen: [
        {
          befristetArt: "lifeInsurance",
        },
      ],
    };

    createChecklistSteps(mockPDFDocument, mockDocumentStruct, customUserData);

    expect(mockPDFDocument.list).toHaveBeenCalledWith(
      expect.arrayContaining([
        "Unterlagen zu Ihrem rechtlichen Problem",

        "Ihren aktuellen Bürgergeld-Bescheid",
        "Kontoauszüge der letzten 3 Monate",
        "Kopie des letzten Jahreskontoauszugs für Ihre Lebensversicherung",
      ]),
      expect.any(Number),
      expect.any(Number),
      expect.any(Object),
    );
  });
});
