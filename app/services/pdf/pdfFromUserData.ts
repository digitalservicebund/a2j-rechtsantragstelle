import type PDFDocument from "pdfkit";
import type { AllContexts } from "~/domains/common";
import { createPdfKitDocument } from "~/domains/fluggastrechte/services/pdf/createPdfKitDocument";

export type PDFDocumentBuilder<TContext extends AllContexts> = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: TContext,
) => void;

export async function pdfFromUserData<TContext extends AllContexts>(
  userData: TContext,
  buildPDFDocument: PDFDocumentBuilder<TContext>,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = createPdfKitDocument();
    const chunks: Uint8Array[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("error", (err) =>
      reject(new Error(`PDF generation error: ${err.message}`)),
    );
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    const documentStruct = doc.struct("Document");
    doc.addStructure(documentStruct);

    buildPDFDocument(doc, documentStruct, userData);

    documentStruct.end();
    doc.end();
  });
}
