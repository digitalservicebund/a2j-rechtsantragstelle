import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addFlightDetails } from "./addFlightDetails";
import { addReason } from "./addReason";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";
import { addCompensationAmount } from "./compensationAmount/addCompensationAmount";
import { addDetailedReason } from "./detailedReason/addDetailedReason";
import { addTable } from "./table/addTable";
import { COLUMN_HEIGHT, MARGIN_BOTTOM } from "./table/tableConfigurations";

export const FACTS_OF_CASES_TEXT = "I. Sachverhalt";

export const createFactsOfCases = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const issueSect = doc.struct("Sect");
  issueSect.add(
    doc.struct("H3", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(FACTS_OF_CASES_TEXT);
      doc.moveDown(MARGIN_BETWEEN_SECTIONS);
    }),
  );
  documentStruct.add(issueSect);

  addReason(doc, documentStruct, userData);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
  addFlightDetails(doc, documentStruct, userData);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
  addDetailedReason(doc, documentStruct, userData);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
  addNewPageInCaseMissingVerticalSpace(doc, COLUMN_HEIGHT * 4 + MARGIN_BOTTOM);
  const startTableY = doc.y;
  addTable(doc, documentStruct, startTableY, userData);
  addCompensationAmount(doc, documentStruct, userData);
};
