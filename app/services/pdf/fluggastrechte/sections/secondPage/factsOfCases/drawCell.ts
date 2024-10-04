import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

const cellSpaceX = 5;
const cellSpaceY = 5;

// eslint-disable-next-line sonarjs/sonar-max-params
export function drawCell(
  doc: typeof PDFDocument,
  xPosition: number,
  yPosition: number,
  width: number,
  height: number,
  boldText: string,
  normalText: string,
  extraXSpace = 0,
) {
  const textX = xPosition + cellSpaceX + extraXSpace;
  const textY = yPosition + cellSpaceY;
  doc.save().rect(xPosition, yPosition, width, height).stroke("silver");

  if (boldText.length > 0) {
    doc.fontSize(10).font(FONTS_BUNDESSANS_BOLD).text(boldText, textX, textY);
  }

  if (normalText.length > 0) {
    const extraSpaceY = boldText.length > 0 ? 12 : 0;

    doc
      .fontSize(8)
      .font(FONTS_BUNDESSANS_REGULAR)
      .text(normalText, textX, textY + extraSpaceY);
  }
  doc.restore();
}
