import type PDFDocument from "pdfkit";
import { PDF_HEIGHT_SEIZE } from "../createPdfKitDocument";

export const createStamp = (doc: typeof PDFDocument) => {
  const stampTextWidth = 188;
  const stampTextHeight = 20;
  const stampText = "Erstellt mit Hilfe des Onlinedienstes service.justiz.de";

  doc
    .save()
    .fontSize(8)
    .rotate(-90, { origin: [50, 780] })
    .text(stampText, stampTextHeight * 3, PDF_HEIGHT_SEIZE, {
      align: "center",
      width: stampTextWidth,
      baseline: "middle",
    })
    .rect(stampTextHeight * 3, 750, stampTextWidth, stampTextHeight)
    .stroke()
    .restore();
};
