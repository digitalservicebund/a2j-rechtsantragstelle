import { addCellText } from "./addCellText";
import { drawCell } from "./drawCell";

export function drawTextCell(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number,
  boldText: string,
  regularText: string,
  shouldAddSilverBackground: boolean,
  textAlign: "left" | "center",
  regularTextFontSize?: number,
) {
  addCellText(doc, {
    xPosition: x,
    yPosition: y,
    width,
    height,
    boldText,
    regularText,
    shouldAddSilverBackground,
    textAlign,
    regularTextFontSize,
  });
  drawCell(doc, {
    xPosition: x,
    yPosition: y,
    width,
    height,
    shouldAddSilverBackground,
  });
}
