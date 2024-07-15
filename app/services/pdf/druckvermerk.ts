import { RotationTypes, type PDFDocument } from "pdf-lib";

const fontSize = 8;
const defaultX = 28;
const defaultY = 60;
const defaultText = "Dieser Antrag wurde erstellt durch service.justiz.de";
const spacePerCharacter = 3.7;

export function addDruckvermerk(pdfDoc: PDFDocument, yPositions?: number[]) {
  pdfDoc.getPages().forEach((page, index) => {
    const yPosition = yPositions ? (yPositions[index] ?? defaultY) : defaultY;

    page.drawRectangle({
      x: defaultX,
      y: yPosition,
      width: 20,
      height: defaultText.length * spacePerCharacter,
      opacity: 0,
      borderWidth: 1,
    });

    page.drawText(defaultText, {
      x: defaultX + 12,
      y: yPosition + 6,
      rotate: { type: RotationTypes.Degrees, angle: 90 },
      size: fontSize,
    });
  });
}
