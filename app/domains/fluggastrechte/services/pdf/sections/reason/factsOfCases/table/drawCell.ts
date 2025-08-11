import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "~/services/pdf/createPdfKitDocument";

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

export function drawCellBackground(
  doc: typeof PDFDocument,
  {
    xPosition,
    yPosition,
    width,
    height,
    shouldAddSilverBackground,
  }: Pick<
    CellOptions,
    "xPosition" | "yPosition" | "width" | "height" | "shouldAddSilverBackground"
  >,
) {
  if (shouldAddSilverBackground) {
    doc.markContent("Artifact", { type: "Layout" });
    doc
      .save()
      .fillColor("silver", 0.1)
      .rect(xPosition, yPosition, width, height)
      .fill()
      .restore();
    doc.endMarkedContent();
  }
  doc.markContent("Artifact", { type: "Layout" });
  doc
    .save()
    .strokeColor("silver", 0.1)
    .rect(xPosition, yPosition, width, height)
    .stroke()
    .restore();
  doc.endMarkedContent();
}

export function drawCellText(
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
  const marginX = 4;
  const marginY = 5;
  const textX = xPosition + marginX;
  const textY = yPosition + marginY;

  const options = {
    width: width - marginX,
    align: textAlign,
    height: height - marginY,
  };

  if (boldText.length > 0) {
    doc
      .fontSize(10)
      .font(FONTS_BUNDESSANS_BOLD)
      .text(boldText, textX, textY, options);
  }

  if (regularText.length > 0) {
    const extraMarginSpace = boldText.length > 0 ? -8 : marginY + 4;
    doc.fontSize(regularTextFontSize);
    const textToAlignVertically =
      (height - doc.heightOfString(regularText, options) - extraMarginSpace) /
      2;

    doc
      .font(FONTS_BUNDESSANS_REGULAR)
      .text(regularText, textX, textY + textToAlignVertically, options);
  }
}
