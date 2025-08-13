import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";
import type { CellOptions } from "./drawTextCell";

type AddCellTextOptions = Omit<CellOptions, "shouldAddSilverBackground">;

const MARGIN_X = 4;
const MARGIN_Y = 5;

export function addCellText(
  doc: PDFKit.PDFDocument,
  {
    x,
    y,
    width,
    height,
    boldText,
    regularText,
    regularTextFontSize = 8,
    textAlign,
  }: AddCellTextOptions,
) {
  const textX = x + MARGIN_X;
  const textY = y + MARGIN_Y;

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
