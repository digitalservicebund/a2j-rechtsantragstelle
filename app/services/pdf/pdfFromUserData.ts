import type PDFDocument from "pdfkit";
import type { UserData } from "~/domains/userData";
import { createPdfKitDocument } from "~/services/pdf/createPdfKitDocument";
import type { Translations } from "~/services/translations/getTranslationByKey";
import type { AttachmentEntries } from "./attachment";

export type PDFDocumentBuilder<TUserData extends UserData> = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: TUserData,
  attachment?: AttachmentEntries,
  translations?: Translations,
) => void;

export async function pdfFromUserData<TUserData extends UserData>(
  userData: TUserData,
  buildPDFDocument: PDFDocumentBuilder<TUserData>,
  attachment?: AttachmentEntries,
  translations?: Translations,
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

    buildPDFDocument(doc, documentStruct, userData, attachment, translations);

    documentStruct.end();
    doc.end();
  });
}
