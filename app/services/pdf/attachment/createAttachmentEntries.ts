import type PDFDocument from "pdfkit";
import type { AttachmentEntries } from "~/services/pdf/attachment";
import { pdfStyles } from "../pdfStyles";

export function createAttachmentEntries(
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  attachment: AttachmentEntries | undefined,
) {
  if (attachment) {
    attachment.forEach((entry) => {
      documentStruct.add(
        doc.struct(entry.level ?? "P", {}, () => {
          doc
            .fontSize(
              entry.level
                ? pdfStyles[entry.level].fontSize
                : pdfStyles.page.fontSize,
            )
            .font(pdfStyles.bold.font)
            .text(entry.title)
            .moveDown(entry.level ? 0.5 : 0);
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
