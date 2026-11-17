import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import {
  mockPdfKitDocument,
  mockPdfKitDocumentStructure,
} from "tests/factories/mockPdfKit";

export const emptyUserData: GeldEinklagenAnwaltschaftUserData = {};

export const createPdfTestContext = () => {
  const documentStruct = mockPdfKitDocumentStructure();
  const doc = mockPdfKitDocument(documentStruct);
  return { doc, documentStruct };
};

export const getPrintedText = (doc: PDFKit.PDFDocument) =>
  vi
    .mocked(doc.text)
    .mock.calls.map(([text]) => text)
    .filter((text): text is string => typeof text === "string");
