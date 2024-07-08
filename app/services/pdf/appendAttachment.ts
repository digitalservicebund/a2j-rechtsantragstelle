import type { PDFDocument } from "pdf-lib";

export async function appendAttachment(
  pdfDoc: PDFDocument,
  attachment: PDFDocument,
) {
  for (let index = 0; index < attachment.getPageCount(); index++) {
    const [attachmentPage] = await pdfDoc.copyPages(attachment, [index]);
    pdfDoc.addPage(attachmentPage);
  }
}
