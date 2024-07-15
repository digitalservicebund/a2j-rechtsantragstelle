import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { addDruckvermerk } from "../druckvermerk";

export async function pdfFromReact(reactDoc: JSX.Element) {
  const pdfDoc = await PDFDocument.load(await renderToBuffer(reactDoc));
  addDruckvermerk(pdfDoc);
  return pdfDoc;
}
