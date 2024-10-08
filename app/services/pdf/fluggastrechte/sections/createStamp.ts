import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_HEIGHT_SEIZE,
} from "../createPdfKitDocument";

export const createStamp = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const stampTextWidth = 188;
  const stampTextHeight = 20;
  const stampText = "Erstellt mit Hilfe des Onlinedienstes service.justiz.de";

  // Artifact Section for the stamp
  const stampSect = doc.struct("Sect");
  stampSect.add(
    doc.struct("P", {}, () => {
      doc
        .save()
        .fontSize(8)
        .rotate(-90, { origin: [50, 780] })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(stampText, stampTextHeight * 3, PDF_HEIGHT_SEIZE, {
          align: "center",
          width: stampTextWidth,
          baseline: "middle",
        })
        .rect(stampTextHeight * 3, 750, stampTextWidth, stampTextHeight)
        .stroke()
        .restore();
    }),
  );
  documentStruct.add(stampSect);
};
