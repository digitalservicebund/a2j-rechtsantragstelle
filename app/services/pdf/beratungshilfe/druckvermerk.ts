import { RotationTypes, type PDFDocument } from "pdf-lib";

const size = 8;
const position = { x: 20, y: 20 };
const rotate = { type: RotationTypes.Degrees, angle: 90 };

export function addDruckvermerk(pdfDoc: PDFDocument, vermerk: string) {
  pdfDoc.getPages().forEach((page) => {
    page.drawText(vermerk, { ...position, rotate, size });
  });
}
