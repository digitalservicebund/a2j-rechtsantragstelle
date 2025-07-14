import {
  FONTS_BUNDESSANS_BOLD,
  PDF_HEIGHT_SEIZE,
} from "~/services/pdf/createPdfKitDocument";

export const STAMP_TEXT =
  "Erstellt mit Hilfe des Onlinedienstes service.justiz.de";

export const STAMP_TEXT_WIDTH = 188;
const STAMP_TEXT_HEIGHT = 20;

function drawStampText(doc: PDFKit.PDFDocument) {
  doc
    .fontSize(8)
    .rotate(-90, { origin: [55, 770] })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(STAMP_TEXT, STAMP_TEXT_HEIGHT * 2, PDF_HEIGHT_SEIZE - 20, {
      align: "center",
      width: STAMP_TEXT_WIDTH,
      baseline: "middle",
    })
    .rotate(90, { origin: [55, 770] });
}

function drawStampDecoration(doc: PDFKit.PDFDocument) {
  doc
    .rotate(-90, { origin: [55, 770] })
    .rect(STAMP_TEXT_HEIGHT * 2, 750, STAMP_TEXT_WIDTH, STAMP_TEXT_HEIGHT)
    .stroke()
    .rotate(90, { origin: [55, 770] });
}

export function createStamp(
  doc: PDFKit.PDFDocument,
  footerSect: PDFKit.PDFStructureElement,
  isLastPage: boolean,
) {
  doc.save();

  doc.markContent("Artifact", { type: "Layout" });
  drawStampDecoration(doc);
  doc.endMarkedContent();

  if (isLastPage) {
    const stampParagraph = doc.struct("P", {}, () => {
      drawStampText(doc);
    });
    footerSect.add(stampParagraph);
  } else {
    doc.markContent("Artifact", { type: "Pagination" });
    drawStampText(doc);
    doc.endMarkedContent();
  }

  doc.restore();
}
