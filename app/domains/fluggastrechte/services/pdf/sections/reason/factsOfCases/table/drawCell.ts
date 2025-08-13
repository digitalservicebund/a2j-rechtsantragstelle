import { type CellOptions } from "./cellOptions";

type DrawCellOptions = Omit<
  CellOptions,
  "boldText" | "regularText" | "regularTextFontSize" | "textAlign"
>;

export function drawCell(
  doc: PDFKit.PDFDocument,
  { x, y, width, height, shouldAddSilverBackground }: DrawCellOptions,
) {
  if (shouldAddSilverBackground) {
    doc.markContent("Artifact", { type: "Layout" });
    doc
      .save()
      .fillColor("silver", 0.1)
      .rect(x, y, width, height)
      .fill()
      .restore();
    doc.endMarkedContent();
  }
  doc.markContent("Artifact", { type: "Layout" });
  doc
    .save()
    .strokeColor("silver", 0.1)
    .rect(x, y, width, height)
    .stroke()
    .restore();
  doc.endMarkedContent();
}
