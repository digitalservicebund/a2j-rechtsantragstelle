import { addCellText } from "./addCellText";
import { drawCell } from "./drawCell";

export type CellOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  boldText: string;
  regularText: string;
  regularTextFontSize?: number;
  shouldAddSilverBackground: boolean;
  textAlign: "center" | "justify" | "left" | "right";
};

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
