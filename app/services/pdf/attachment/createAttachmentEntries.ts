import type PDFDocument from "pdfkit";
import type { AttachmentEntries } from "~/services/pdf/attachment";
import { pdfStyles } from "../pdfStyles";

export function createAttachmentEntries(
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  attachment: AttachmentEntries | undefined,
) {
  if (attachment) {
    attachment.forEach((entry, index) => {
      documentStruct.add(
        doc.struct(entry.level?.toUpperCase() ?? "P", {}, () => {
          doc
            // only move down if the current entry is a heading
            // and the previous entry is not a heading
            // and the current entry is not the first entry
            .moveDown(
              entry.level && !attachment[index - 1]?.level && index !== 0
                ? 1
                : 0,
            )
            .fontSize(
              entry.level
                ? pdfStyles[entry.level].fontSize
                : pdfStyles.page.fontSize,
            )
            .font(pdfStyles.bold.font)
            .text(entry.title)
            .moveDown(entry.level ? 1 : 0);
        }),
      );

      if (entry.text) {
        documentStruct.add(
          doc.struct("P", {}, () => {
            doc
              .fontSize(pdfStyles.page.fontSize)
              .font(pdfStyles.page.font)
              .text(entry.text ?? "")
              .moveDown(0.5);
          }),
        );
      }
    });
  }
}
