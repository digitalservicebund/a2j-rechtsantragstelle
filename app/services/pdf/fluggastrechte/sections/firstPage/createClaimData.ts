import type PDFDocument from "pdfkit";

const addPersonDetails = (
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  doc
    .fontSize(10)
    .font(bundesSansWebBold)
    .text("Włodzimierz Ciesiński", { continued: true });
  doc.font(bundesSansWebRegular).text(" | Musterstr. 3, 12345 Musterhausen");
  doc.text("0176 30441234");
  doc.text("– Klagende Partei –", { align: "left" });
};

const addAirlineDetails = (
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  doc
    .fontSize(10)
    .font(bundesSansWebBold)
    .text("Deutsche Lufthansa Aktiengesellschaft", { continued: true });
  doc.font(bundesSansWebRegular).text(" | Venloer Straße 151-153, 50672 Köln");
  doc.text("– Beklagte Partei –");
};

const addFlightDetails = (
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  doc
    .fontSize(12)
    .font(bundesSansWebBold)
    .text(
      "Wegen: Ausgleichszahlung nach der Fluggastrechteverordnung (EG) 261/2004",
    );
  doc.font(bundesSansWebBold).text("Betroffener Flug:");
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font(bundesSansWebRegular)
    .text("Flugnummer:", { continued: true })
    .font(bundesSansWebBold)
    .text(" AB1234");
  doc.moveDown(0.2);
  doc
    .font(bundesSansWebRegular)
    .text("Geplantes Abflugdatum:", { continued: true })
    .font(bundesSansWebBold)
    .text(" 10.03.2024");
  doc.moveDown(0.2);
  doc.fontSize(12).font(bundesSansWebBold).text("Streitwert: 500€");
};

export const createClaimData = (
  doc: typeof PDFDocument,
  bundesSansWebRegular: ArrayBuffer,
  bundesSansWebBold: ArrayBuffer,
) => {
  doc.fontSize(14).font(bundesSansWebBold).text("in der Sache");
  doc.moveDown();

  addPersonDetails(doc, bundesSansWebRegular, bundesSansWebBold);

  doc.moveDown();
  doc.fontSize(14).font(bundesSansWebBold).text("gegen", { align: "left" });
  doc.moveDown();

  addAirlineDetails(doc, bundesSansWebRegular, bundesSansWebBold);

  doc.moveDown();

  addFlightDetails(doc, bundesSansWebRegular, bundesSansWebBold);
};
