import type PDFDocument from "pdfkit";
import { addDetailedReason } from "./addDetailedReason";
import { addFlightDetails } from "./addFlightDetails";
import { addLastSentences } from "./addLastSentences";
import { addReason } from "./addReason";
import { addTable } from "./addTable";
import { FONTS_BUNDESSANS_BOLD } from "../../../createPdfKitDocument";

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

  addReason(doc, documentStruct);
  doc.moveDown(1);
  addFlightDetails(doc, documentStruct);
  doc.moveDown(1);
  addDetailedReason(doc, documentStruct);
  doc.moveDown(1);
  addTable(doc, documentStruct);
  doc.moveDown(2);
  addLastSentences(doc, documentStruct);
  doc.moveDown(1);
};
