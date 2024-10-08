import type PDFDocument from "pdfkit";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN,
} from "../../../createPdfKitDocument";

type FlightDetail = {
  text: string;
  value: string;
};

const FLIGHT_DETAILS: FlightDetail[] = [
  {
    text: "Buchungsnummer:",
    value: "YBIRI7",
  },
  {
    text: "Flugnummer:",
    value: "AB1234",
  },
  {
    text: "Geplantes Abflugdatum:",
    value: "10.03.2024",
  },
  {
    text: "Startflughafen:",
    value: "Berlin Brandenburg Flughafen (BER)",
  },
  {
    text: "Zielflughafen: ",
    value: "Athens International Airport (ATH)",
  },
];

export const addFlightDetails = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const originalFlightDetailsSect = doc.struct("Sect");
  originalFlightDetailsSect.add(
    doc.struct("P", {}, () => {
      FLIGHT_DETAILS.forEach((flightDetail) => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(flightDetail.text, PDF_MARGIN + 10, undefined, {
            continued: true,
          })
          .font(FONTS_BUNDESSANS_BOLD)
          .text(flightDetail.value);

        doc.moveDown(0.5);
      });
    }),
  );
  documentStruct.add(originalFlightDetailsSect);
};
