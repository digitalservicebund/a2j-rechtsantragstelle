import { RotationTypes, type PDFDocument } from "pdf-lib";

const fontSize = 8;
const defaultX = 28;
const defaultY = 60;
const defaultText = "Dieser Antrag wurde erstellt durch service.justiz.de";
const spacePerCharacter = 3.7;

export function addDruckvermerk(
  pdfDoc: PDFDocument,
  yPosition?: number | number[],
  xPosition?: number,
) {
  pdfDoc.getPages().forEach((page, index) => {
    const yPos =
      (Array.isArray(yPosition) ? yPosition[index] : yPosition) ?? defaultY;
    const xPos =
      (Array.isArray(xPosition) ? xPosition[index] : xPosition) ?? defaultX;

    page.drawRectangle({
      x: xPos,
      y: yPos,
      width: 20,
      height: defaultText.length * spacePerCharacter,
      opacity: 0,
      borderWidth: 1,
    });

    page.drawText(defaultText, {
      x: xPos + 12,
      y: yPos + 6,
      rotate: { type: RotationTypes.Degrees, angle: 90 },
      size: fontSize,
    });
  });
}
