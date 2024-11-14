import type PDFDocument from "pdfkit";
import type { AllContexts } from "~/domains/common";
import { createPdfKitDocument } from "~/services/pdf/createPdfKitDocument";
import type { AttachmentEntries } from "./attachment";

export type PDFDocumentBuilder<TContext extends AllContexts> = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: TContext,
  attachment?: AttachmentEntries,
) => void;

export async function pdfFromUserData<TContext extends AllContexts>(
  userData: TContext,
  buildPDFDocument: PDFDocumentBuilder<TContext>,
  attachment?: AttachmentEntries,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = createPdfKitDocument();
    const chunks: Uint8Array[] = [];

    // Collect PDF chunks
    doc.on("data", (chunk) => chunks.push(chunk));

    // Handle the error event
    doc.on("error", (err) =>
      reject(new Error(`PDF generation error: ${err.message}`)),
    );

    // Resolve the promise when the PDF generation is finished
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const documentStruct = doc.struct("Document");
    doc.addStructure(documentStruct);

    buildPDFDocument(doc, documentStruct, userData, attachment);

    documentStruct.end();
    doc.end();
  });
}
