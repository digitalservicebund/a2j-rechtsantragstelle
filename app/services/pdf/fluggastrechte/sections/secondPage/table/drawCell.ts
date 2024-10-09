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
  shouldDrawRectangle?: boolean;
};

const cellSpaceX = 5;
const cellSpaceY = 5;

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
    shouldDrawRectangle = true,
  }: CellOptions,
) {
  const textX = xPosition + cellSpaceX;
  const textY = yPosition + cellSpaceY;

  if (shouldAddSilverBackground) {
    doc
      .save()
      .fill("silver")
      .fillOpacity(0.1)
      .rect(xPosition, yPosition, width, height)
      .fill()
      .restore();
  }

  doc.save();

  if (shouldDrawRectangle) {
    doc.rect(xPosition, yPosition, width, height).stroke("silver");
  }

  if (boldText.length > 0) {
    doc
      .fontSize(10)
      .font(FONTS_BUNDESSANS_BOLD)
      .text(boldText, textX, textY, {
        width: width - cellSpaceX,
        height: height - cellSpaceY,
        align: textAlign,
      });
  }

  if (regularText.length > 0) {
    const extraSpaceY = boldText.length > 0 ? 12 : 4;

    doc
      .fontSize(regularTextFontSize)
      .font(FONTS_BUNDESSANS_REGULAR)
      .text(regularText, textX, textY + extraSpaceY, {
        width: width - cellSpaceX,
        align: textAlign,
        height: height - cellSpaceY,
      });
  }
  doc.restore();
}
