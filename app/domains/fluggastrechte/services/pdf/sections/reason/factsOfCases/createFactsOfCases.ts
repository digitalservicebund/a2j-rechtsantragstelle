import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addFlightDetails } from "./addFlightDetails";
import { addReasonCaption } from "./addReasonCaption";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";
import { addCompensationAmount } from "./compensationAmount/addCompensationAmount";
import { addDetailedReason } from "./detailedReason/addDetailedReason";
import { addTable } from "./table/addTable";
import { COLUMN_HEIGHT, MARGIN_BOTTOM } from "./table/tableConfigurations";
import { add } from "lodash";

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
    }),
  );
  documentStruct.add(issueSect);

  //reason and flight details section
  const reasonAndFlightDetailsSect = doc.struct("Sect");
  const reasonAndFlightDetailsList = doc.struct("L");
  reasonAndFlightDetailsList.add(
    doc.struct("Caption", {}, () => {
      addReasonCaption(doc, userData);
    }),
  );
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
  addFlightDetails(doc, reasonAndFlightDetailsList, userData);
  reasonAndFlightDetailsSect.add(reasonAndFlightDetailsList);
  documentStruct.add(reasonAndFlightDetailsSect);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);

  //details section
  addDetailedReason(doc, documentStruct, userData);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
  addNewPageInCaseMissingVerticalSpace(doc, COLUMN_HEIGHT * 4 + MARGIN_BOTTOM);
  const startTableY = doc.y;
  addTable(doc, documentStruct, startTableY, userData);
  addCompensationAmount(doc, documentStruct, userData);
};
