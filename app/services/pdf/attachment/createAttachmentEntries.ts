import type PDFDocument from "pdfkit";
import type { AttachmentEntries } from ".";
import { pdfStyles } from "../../../domains/shared/pdf/pdfStyles";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../createPdfKitDocument";

export function createAttachmentEntries(
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  attachment: AttachmentEntries | undefined,
) {
  if (attachment) {
    attachment.forEach((entry) => {
      documentStruct.add(
        doc.struct(entry.level ?? "h5", {}, () => {
          doc
            .fontSize(
              entry.level
                ? pdfStyles[entry.level].fontSize
                : pdfStyles.page.fontSize,
            )
            .font(FONTS_BUNDESSANS_BOLD)
            .text(entry.title)
            .moveDown(entry.level ? 0.5 : 0);
        }),
      );
      if (entry.text) {
        documentStruct.add(
          doc.struct("P", {}, () => {
            doc
              .fontSize(pdfStyles.page.fontSize)
              .font(FONTS_BUNDESSANS_REGULAR)
              .text(entry.text ?? "")
              .moveDown(0.5);
          }),
        );
      }
    });
  }
}
