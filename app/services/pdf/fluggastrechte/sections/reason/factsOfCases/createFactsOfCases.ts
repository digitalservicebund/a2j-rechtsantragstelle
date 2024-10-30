import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { addCompensationAmount } from "./addCompensationAmount";
import { addDetailedReason } from "./addDetailedReason";
import { addFlightDetails } from "./addFlightDetails";
import { addReason } from "./addReason";
import { addTable } from "./table/addTable";
import { FONTS_BUNDESSANS_BOLD } from "../../../createPdfKitDocument";

export const FACTS_OF_CASES_TEXT = "I. Sachverhalt";

export const createFactsOfCases = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const issueSect = doc.struct("Sect");
  issueSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(FACTS_OF_CASES_TEXT);
      doc.moveDown(1);
    }),
  );
  documentStruct.add(issueSect);

  addReason(doc, documentStruct, userData);
  doc.moveDown(1);
  addFlightDetails(doc, documentStruct, userData);
  doc.moveDown(1);
  addDetailedReason(doc, documentStruct, userData);
  doc.moveDown(1);
  addTable(doc, documentStruct);
  doc.moveDown(1);
  addCompensationAmount(doc, documentStruct, userData);
};
