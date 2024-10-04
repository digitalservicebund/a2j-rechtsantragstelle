import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

export const createLocalCourt = (doc: typeof PDFDocument) => {
  const myStruct = doc.struct("P");
  doc.addStructure(myStruct);
  const myStructContent = doc.markStructureContent("P");

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Erstellt am: 04.10.2024", { align: "right" });

  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text("An das", { align: "left" });
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Amtsgericht Königs Wusterhausen", { align: "left" });
  doc.text("Schlossplatz 4", { align: "left" });
  doc.text("15711 Königs Wusterhausen", { align: "left" });
  doc.endMarkedContent();
  myStruct.add(myStructContent);
  myStruct.end();
};
