import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

const MARGIN_X = 4;
const MARGIN_Y = 5;

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
export function addCellText(
  doc: typeof PDFDocument,
  {
    xPosition,
    yPosition,
    width,
    height,
    boldText,
    regularText,
    regularTextFontSize = 8,
    textAlign,
  }: CellOptions,
) {
  const textX = xPosition + MARGIN_X;
  const textY = yPosition + MARGIN_Y;

  const options = {
    width: width - MARGIN_X,
    align: textAlign,
    height: height - MARGIN_Y,
  };

  if (boldText.length > 0) {
    doc
      .fontSize(10)
      .font(FONTS_BUNDESSANS_BOLD)
      .text(boldText, textX, textY, options);
  }

  if (regularText.length > 0) {
    const extraMarginSpace = boldText.length > 0 ? -8 : MARGIN_Y + 4;
    doc.fontSize(regularTextFontSize);
    const textToAlignVertically =
      (height - doc.heightOfString(regularText, options) - extraMarginSpace) /
      2;

    doc
      .font(FONTS_BUNDESSANS_REGULAR)
      .text(regularText, textX, textY + textToAlignVertically, options);
  }
}
