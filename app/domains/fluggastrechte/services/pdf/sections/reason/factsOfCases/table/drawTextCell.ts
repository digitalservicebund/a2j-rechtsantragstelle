import { addCellText } from "./addCellText";
import { type CellOptions } from "./cellOptions";
import { drawCell } from "./drawCell";

export function drawTextCell(
  doc: PDFKit.PDFDocument,
  cellType: "TH" | "TD",
  {
    x,
    y,
    width,
    height,
    boldText,
    regularText,
    regularTextFontSize = 8,
    shouldAddSilverBackground,
    textAlign = "left",
  }: CellOptions,
) {
  drawCell(doc, {
    x,
    y,
    width,
    height,
    shouldAddSilverBackground,
  });

  return doc.struct(cellType, {}, () => {
    addCellText(doc, {
      x: x,
      y: y,
      width,
      height,
      boldText,
      regularText,
      regularTextFontSize,
      textAlign,
    });
  });
}
