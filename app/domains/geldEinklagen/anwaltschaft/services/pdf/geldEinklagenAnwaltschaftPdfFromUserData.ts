import { type GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import type { PDFDocumentBuilder } from "~/services/pdf/pdfFromUserData";
import { pdfFromUserData } from "~/services/pdf/pdfFromUserData";
import { setPdfMetadata } from "~/services/pdf/setPdfMetadata";
import { createFirstPage } from "./sections/createFirstPage";
import { createSecondPage } from "./sections/createSecondPage";
import { createFooter } from "~/services/pdf/footer/createFooter";

const TITLE = "Klage Neueingang";
const SUBJECT = "Klageschrift";
const KEYWORDS = "Geld einklagen";

const buildGeldEinklagenAnwaltschaftPDFDocument: PDFDocumentBuilder<
  GeldEinklagenAnwaltschaftUserData
> = (doc, documentStruct, userData) => {
  setPdfMetadata(doc, { title: TITLE, subject: SUBJECT, keywords: KEYWORDS });
  createFirstPage(doc, documentStruct, userData);
  createSecondPage(doc, documentStruct, userData);

  const { start, count } = doc.bufferedPageRange();
  const margins = Array.from({ length: count }, (_, index) => {
    doc.switchToPage(start + index);
    const pageMargins = doc.page.margins;
    const bottom = pageMargins.bottom;
    // Fixed-position footers must not paginate at the body text's bottom margin.
    pageMargins.bottom = 0;
    return { pageMargins, bottom };
  });
  try {
    createFooter(doc, documentStruct, userData);
  } finally {
    margins.forEach(({ pageMargins, bottom }) => {
      pageMargins.bottom = bottom;
    });
  }
};

export function geldEinklagenAnwaltschaftPdfFromUserdata(
  userData: GeldEinklagenAnwaltschaftUserData,
) {
  return pdfFromUserData(userData, buildGeldEinklagenAnwaltschaftPDFDocument);
}
