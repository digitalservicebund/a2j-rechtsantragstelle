import type PDFDocument from "pdfkit";
import { readRelativeFileToBuffer } from "~/services/pdf/fillPdf.server";
import { createPdfKitDocument } from "./createPdfKitDocument";
import { createFirstPage } from "./sections/firstPage/createFirstPage";
import { createSecondPage } from "./sections/secondPage/createSecondPage";
import { createThirdPage } from "./sections/thirdPage/createThirdPage";
import { setPdfMetadata } from "./setPdfMetadata";

const BundesSansWebRegular = await readRelativeFileToBuffer(
  "public/fonts/BundesSansWeb-Regular.woff",
);
const BundesSansWebBold = await readRelativeFileToBuffer(
  "public/fonts/BundesSansWeb-Bold.woff",
);

function buildDocument(
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) {
  setPdfMetadata(doc);
  createFirstPage(doc, documentStruct);
  doc.addPage();
  createSecondPage(doc, documentStruct);
  doc.addPage();
  createThirdPage(doc, documentStruct);
}

export async function fluggastrechtePdfFromUserdata(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = createPdfKitDocument(BundesSansWebRegular, BundesSansWebBold);
    const chunks: Uint8Array[] = [];

    // Collect PDF chunks
    doc.on("data", (chunk) => chunks.push(chunk));

    // Handle the error event
    doc.on("error", (err) => {
      reject(new Error(`PDF generation error: ${err.message}`));
    });

    // Resolve the promise when the PDF generation is finished
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    const documentStruct = doc.struct("Document");
    doc.addStructure(documentStruct);

    // Generate the PDF content
    buildDocument(doc, documentStruct);

    documentStruct.end();
    doc.end();
  });
}
