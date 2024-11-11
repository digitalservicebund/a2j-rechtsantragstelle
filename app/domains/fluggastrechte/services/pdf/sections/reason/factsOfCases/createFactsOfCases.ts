import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addCompensationAmount } from "./addCompensationAmount";
import { addDetailedReason } from "./addDetailedReason";
import { addFlightDetails } from "./addFlightDetails";
import { addReason } from "./addReason";
import { addTable } from "./table/addTable";
import { COLUMN_HEIGHT } from "./table/tableConfigurations";

export const FACTS_OF_CASES_TEXT = "I. Sachverhalt";
const MARGIN_TOP = 10;

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
  const startTableY = doc.y; // check the y position when the table should start to print
  addTable(doc, documentStruct, startTableY);
  doc.moveDown(1);
  const compensationStartYPosition =
    startTableY + COLUMN_HEIGHT * 4 + MARGIN_TOP; // calculate where the compensation it should start to print
  addCompensationAmount(
    doc,
    documentStruct,
    userData,
    compensationStartYPosition,
  );
};
