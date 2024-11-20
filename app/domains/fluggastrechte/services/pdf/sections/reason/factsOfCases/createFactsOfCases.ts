import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addCompensationAmount } from "./addCompensationAmount";
import { addDetailedReason } from "./addDetailedReason";
import { addFlightDetails } from "./addFlightDetails";
import { addReason } from "./addReason";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";
import { addTable } from "./table/addTable";
import { addTableInfo } from "./table/addTableInfo";
import { COLUMN_HEIGHT } from "./table/tableConfigurations";

export const FACTS_OF_CASES_TEXT = "I. Sachverhalt";
const MARGIN_TOP = 15;

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
  addNewPageInCaseMissingVerticalSpace(doc, COLUMN_HEIGHT * 4 + MARGIN_TOP);
  const startTableY = doc.y;
  addTable(doc, documentStruct, startTableY, userData);

  // Set tableEndYPosition based on the existence of `andereErsatzverbindungBeschreibung`
  const tableEndYPosition = startTableY + COLUMN_HEIGHT * 4 + MARGIN_TOP;

  addTableInfo(
    doc,
    documentStruct,
    userData.andereErsatzverbindungBeschreibung ?? "",
    tableEndYPosition,
  );
  doc.moveDown(1);
  let startCompensationYPosition = tableEndYPosition;
  if (
    userData.andereErsatzverbindungBeschreibung &&
    userData.andereErsatzverbindungBeschreibung?.length >= 0
  ) {
    startCompensationYPosition = doc.y;
  }

  addCompensationAmount(
    doc,
    documentStruct,
    userData,
    startCompensationYPosition,
  );
};
