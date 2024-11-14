import { RotationTypes, type PDFDocument } from "pdf-lib";
import { STAMP_TEXT } from "~/services/pdf/createStamp";

const fontSize = 8;
const defaultX = 28;
const defaultY = 60;
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
      height: STAMP_TEXT.length * spacePerCharacter,
      opacity: 0,
      borderWidth: 1,
    });

    page.drawText(STAMP_TEXT, {
      x: xPos + 12,
      y: yPos + 6,
      rotate: { type: RotationTypes.Degrees, angle: 90 },
      size: fontSize,
    });
  });
}
