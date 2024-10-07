import type PDFDocument from "pdfkit";
import { addTable } from "./addTable";
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

const addFlightDetails = (
  flightDetails: FlightDetail[],
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const originalFlightDetailsSect = doc.struct("Sect");
  originalFlightDetailsSect.add(
    doc.struct("P", {}, () => {
      flightDetails.forEach((flightDetail) => {
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

const addLastSentences = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const compensationSect = doc.struct("Sect");
  compensationSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10).text(
        "Die Fluggesellschaft hat keine außergewöhnlichen Umstände als Grund für die Verspätung mitgeteilt. Die klagende Partei geht davon aus, dass die genannten Umstände nicht korrekt ist.",
        PDF_MARGIN,
        480, // start to print this text from this line
      );

      doc.moveDown(1);

      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text(
          "Die klagende Partei forderte außergerichtlich die Ausgleichszahlungen gemäß Art. 7 der Fluggastrechteverordnung (EG) 261/2004 von der beklagten Partei mit einer Frist zum Datum der Frist ein. Die beklagte Partei hat jedoch bisher keine Zahlung geleistet.",
        );
    }),
  );
  documentStruct.add(compensationSect);
};

export const createFactsOfCases = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
) => {
  const issueSect = doc.struct("Sect");
  issueSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text("I. Sachverhalt");
      doc.moveDown(1);
    }),
  );
  documentStruct.add(issueSect);

  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          "Die klagende Partei buchte den folgenden Flug, der von der beklagten Partei ",
          { continued: true },
        )
        .font(FONTS_BUNDESSANS_BOLD)
        .text("nicht pünktlich ausgeführt ", { continued: true })
        .font(FONTS_BUNDESSANS_REGULAR)
        .text("wurde:");
    }),
  );
  documentStruct.add(reasonSect);

  doc.moveDown(1);

  addFlightDetails(FLIGHT_DETAILS, doc, documentStruct);

  doc.moveDown(1);

  const detailedReasonSect = doc.struct("Sect");
  detailedReasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .font(FONTS_BUNDESSANS_REGULAR)
        .fontSize(10)
        .text("Die klagende Partei war pünktlich zum Check-in.", PDF_MARGIN)
        .text(
          "Der Flug von Berlin Brandenburg Flughafen (BER) nach Athens International Airport (ATH) hatte die genannte Verspätung.",
        );
    }),
  );
  documentStruct.add(detailedReasonSect);

  doc.moveDown(1);

  addTable(doc);

  doc.moveDown(2);

  addLastSentences(doc, documentStruct);

  doc.moveDown(1);
};
