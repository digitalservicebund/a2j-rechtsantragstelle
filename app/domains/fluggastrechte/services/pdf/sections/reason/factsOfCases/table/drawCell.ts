import type PDFDocument from "pdfkit";

type DrawOptions = {
  xPosition: number;
  yPosition: number;
  width: number;
  height: number;
  shouldAddSilverBackground?: boolean;
};

export function drawCell(
  doc: typeof PDFDocument,
  {
    xPosition,
    yPosition,
    width,
    height,
    shouldAddSilverBackground,
  }: DrawOptions,
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
