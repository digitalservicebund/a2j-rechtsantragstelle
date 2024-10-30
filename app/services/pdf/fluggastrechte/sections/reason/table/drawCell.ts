import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

type CellOptions = {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  boldText: string;
  regularText: string;
  regularTextFontSize?: number;
  shouldAddSilverBackground: boolean;
  textAlign: "center" | "justify" | "left" | "right";
};

const marginX = 4;
const marginY = 5;

export function drawCell(
  doc: typeof PDFDocument,
  {
    xPosition,
    yPosition,
    width,
    height,
    boldText,
    regularText,
    regularTextFontSize = 8,
    shouldAddSilverBackground,
    textAlign,
  }: CellOptions,
) {
  const textX = xPosition + marginX;
  const textY = yPosition + marginY;

  if (shouldAddSilverBackground) {
    doc
      .save()
      .fillColor("silver", 0.1)
      .rect(xPosition, yPosition, width, height)
      .fill()
      .restore();
  }

  doc.save().rect(xPosition, yPosition, width, height).stroke("silver");

  if (boldText.length > 0) {
    doc
      .fontSize(10)
      .font(FONTS_BUNDESSANS_BOLD)
      .text(boldText, textX, textY, {
        width: width - marginX,
        height: height - marginY,
        align: textAlign,
      });
  }

  if (regularText.length > 0) {
    const extraSpaceY = boldText.length > 0 ? 12 : 4;

    doc
      .fontSize(regularTextFontSize)
      .font(FONTS_BUNDESSANS_REGULAR)
      .text(regularText, textX, textY + extraSpaceY, {
        width: width - marginX,
        align: textAlign,
        height: height - marginY,
      });
  }
  doc.restore();
}
