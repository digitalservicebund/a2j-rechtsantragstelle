import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";

const REASON_TITLE_TEXT = "Begründung";

export const createReasonPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const pages = doc.bufferedPageRange();

  // If the document is on the first page, we need to add a new page for the reason section
  if (pages.count === 1) {
    doc.addPage();
  }

  const reasonSect = doc.struct("Sect");

  reasonSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(16).font(FONTS_BUNDESSANS_BOLD).text(REASON_TITLE_TEXT, {
        align: "left",
      });
      doc.moveDown(1.5);
    }),
  );

  documentStruct.add(reasonSect);
};
