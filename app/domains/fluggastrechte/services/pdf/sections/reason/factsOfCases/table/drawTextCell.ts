import { addCellText } from "./addCellText";
import { drawCell } from "./drawCell";

export function drawTextCell(
  doc: PDFKit.PDFDocument,
  cellType: "TH" | "TD",
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
  drawCell(doc, {
    xPosition: x,
    yPosition: y,
    width,
    height,
    shouldAddSilverBackground,
  });
  return doc.struct(cellType, {}, () => {
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
  });
}
