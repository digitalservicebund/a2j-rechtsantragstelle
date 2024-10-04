import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

const addPersonDetails = (doc: typeof PDFDocument) => {
  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text("Włodzimierz Ciesiński", { continued: true });
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(" | Musterstr. 3, 12345 Musterhausen");
  doc.text("0176 30441234");
  doc.text("– Klagende Partei –", { align: "left" });
};

const addAirlineDetails = (doc: typeof PDFDocument) => {
  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_BOLD)
    .text("Deutsche Lufthansa Aktiengesellschaft", { continued: true });
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text(" | Venloer Straße 151-153, 50672 Köln");
  doc.text("– Beklagte Partei –");
};

const addFlightDetails = (doc: typeof PDFDocument) => {
  doc
    .fontSize(12)
    .font(FONTS_BUNDESSANS_BOLD)
    .text(
      "Wegen: Ausgleichszahlung nach der Fluggastrechteverordnung (EG) 261/2004",
    );
  doc.font(FONTS_BUNDESSANS_BOLD).text("Betroffener Flug:");
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Flugnummer:", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(" AB1234");
  doc.moveDown(0.2);
  doc
    .font(FONTS_BUNDESSANS_REGULAR)
    .text("Geplantes Abflugdatum:", { continued: true })
    .font(FONTS_BUNDESSANS_BOLD)
    .text(" 10.03.2024");
  doc.moveDown(0.2);
  doc.fontSize(12).font(FONTS_BUNDESSANS_BOLD).text("Streitwert: 500€");
};

export const createClaimData = (doc: typeof PDFDocument) => {
  doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("in der Sache");
  doc.moveDown();

  addPersonDetails(doc);

  doc.moveDown();
  doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("gegen", { align: "left" });
  doc.moveDown();

  addAirlineDetails(doc);

  doc.moveDown();

  addFlightDetails(doc);
};
