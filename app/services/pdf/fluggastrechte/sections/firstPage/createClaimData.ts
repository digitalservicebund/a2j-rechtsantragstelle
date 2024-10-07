import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../createPdfKitDocument";

const addPlaintiffDetails = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const plaintiffSect = doc.struct("Sect");
  plaintiffSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Włodzimierz Ciesiński", { continued: true });
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(" | Musterstr. 3, 12345 Musterhausen");
      doc.text("0176 30441234");
      doc.text("– Klagende Partei –", { align: "left" });
    }),
  );
  documentStruct.add(plaintiffSect);
};

const addAirlineDetails = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const AirlineDetailsSect = doc.struct("Sect");
  AirlineDetailsSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("Deutsche Lufthansa Aktiengesellschaft", { continued: true });
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(" | Venloer Straße 151-153, 50672 Köln");
      doc.text("– Beklagte Partei –");
    }),
  );
  documentStruct.add(AirlineDetailsSect);
};

const addFlightDetails = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const claimDetailsSect = doc.struct("Sect");
  claimDetailsSect.add(
    doc.struct("P", {}, () => {
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
    }),
  );
  documentStruct.add(claimDetailsSect);
};

export const createClaimData = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("in der Sache");
  doc.moveDown();

  addPlaintiffDetails(doc, documentStruct);

  doc.moveDown();

  const gegenSect = doc.struct("Sect");
  gegenSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text("gegen", { align: "left" });
    }),
  );
  documentStruct.add(gegenSect);

  doc.moveDown();

  addAirlineDetails(doc, documentStruct);

  doc.moveDown();

  addFlightDetails(doc, documentStruct);
};
