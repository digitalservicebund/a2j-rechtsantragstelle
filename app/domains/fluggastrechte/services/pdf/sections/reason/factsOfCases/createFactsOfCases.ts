import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addDetailedReason } from "./addDetailedReason";
import { addFlightDetails } from "./addFlightDetails";
import { addReason } from "./addReason";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";
import { addCompensationAmount } from "./compensationAmount/addCompensationAmount";
import { addTable } from "./table/addTable";
import { COLUMN_HEIGHT, MARGIN_BOTTOM } from "./table/tableConfigurations";

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
  addNewPageInCaseMissingVerticalSpace(doc, COLUMN_HEIGHT * 4 + MARGIN_BOTTOM);
  const startTableY = doc.y;
  addTable(doc, documentStruct, startTableY, userData);
  // Set tableEndYPosition based on the existence of `andereErsatzverbindungBeschreibung`
  const tableEndYPosition = startTableY + COLUMN_HEIGHT * 4 + MARGIN_BOTTOM;
  doc.moveDown(1);
  const startCompensationYPosition =
    typeof userData.andereErsatzverbindungBeschreibung !== "undefined" &&
    userData.andereErsatzverbindungBeschreibung.length >= 0
      ? doc.y
      : tableEndYPosition;

  addCompensationAmount(
    doc,
    documentStruct,
    userData,
    startCompensationYPosition,
  );
};
