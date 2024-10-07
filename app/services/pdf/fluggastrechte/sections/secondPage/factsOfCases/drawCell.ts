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
  normalText: string;
  normalTextFontSize?: number;
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
    normalText,
    normalTextFontSize = 8,
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
      .text(boldText, textX, textY, { width: width, align: textAlign });
  }

  if (normalText.length > 0) {
    const extraSpaceY = boldText.length > 0 ? 12 : -3;

    doc
      .fontSize(normalTextFontSize)
      .font(FONTS_BUNDESSANS_REGULAR)
      .text(normalText, textX, textY + extraSpaceY, {
        width: width,
        align: textAlign,
      });
  }
  doc.restore();
}
