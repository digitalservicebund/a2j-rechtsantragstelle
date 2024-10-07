import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";

export const addAirlineDetails = (
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
