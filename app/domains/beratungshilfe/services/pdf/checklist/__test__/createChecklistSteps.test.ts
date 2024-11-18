import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import { abgabeContext } from "~/domains/shared/formular/abgabe/context";
import { createChecklistSteps } from "../createChecklistSteps";

describe("createChecklistSteps", () => {
  it("should create checklist steps for 'ausdrucken' abgabeArt", () => {
    const mockDocumentStruct = mockPdfKitDocumentStructure();
    const mockPDFDocument = mockPdfKitDocument(mockDocumentStruct);
    const userData: BeratungshilfeFormularContext = {
      abgabeArt: abgabeContext.abgabeArt.Enum.ausdrucken,
    };
    createChecklistSteps(mockPDFDocument, mockDocumentStruct, userData);

    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      1,
      "1. Antrag ausdrucken",
    );
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      3,
      "2. Antrag unterschreiben",
    );
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      5,
      "3. Benötigte Dokumente kopieren",
    );
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      7,
      "4. Antrag abgeben",
    );
    expect(mockPDFDocument.list).toHaveBeenCalledWith(
      [
        "Unterlagen zu Ihrem rechtlichen Problem",
        "Kopie Ihres aktuellen Mietvertrags",
      ],
      expect.any(Object),
    );
  });

  it("should create checklist steps for 'online' abgabeArt", () => {
    const mockDocumentStruct = mockPdfKitDocumentStructure();
    const mockPDFDocument = mockPdfKitDocument(mockDocumentStruct);
    const onlineUserData: BeratungshilfeFormularContext = {
      abgabeArt: abgabeContext.abgabeArt.Enum.online,
    };

    createChecklistSteps(mockPDFDocument, mockDocumentStruct, onlineUserData);

    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      1,
      "1. Antrag prüfen und speichern",
    );
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      3,
      "2. Benötigte Dokumente scannen",
    );
    expect(mockPDFDocument.text).toHaveBeenNthCalledWith(
      5,
      "3. Antrag über das Portal Mein Justizpostfach versenden",
    );
    expect(mockPDFDocument.list).toHaveBeenCalledWith(
      [
        "Unterlagen zu Ihrem rechtlichen Problem",
        "Kopie Ihres aktuellen Mietvertrags",
      ],
      expect.any(Object),
    );
  });

  it("should include relevant documents based on user data conditions", () => {
    const mockDocumentStruct = mockPdfKitDocumentStructure();
    const mockPDFDocument = mockPdfKitDocument(mockDocumentStruct);
    const customUserData: BeratungshilfeFormularContext = {
      abgabeArt: abgabeContext.abgabeArt.Enum.ausdrucken,
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
        "Kopie Ihres aktuellen Mietvertrags",
        "Ihren aktuellen Bürgergeld-Bescheid",
        "Kontoauszüge der letzten 3 Monate",
        "Kopie des letzten Jahreskontoauszugs für Ihre Lebensversicherung",
      ]),
      expect.any(Object),
    );
  });
});
