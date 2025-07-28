import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addFlightDetails } from "./addFlightDetails";
import { addReasonCaption } from "./addReasonCaption";
import { addDetailedReason } from "./detailedReason/addDetailedReason";

export const FACTS_OF_CASES_TEXT = "I. Sachverhalt";

export const createFactsOfCases = (
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  reasonSect.add(
    doc.struct("H3", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(FACTS_OF_CASES_TEXT);
      doc.moveDown(1);
    }),
  );

  const reasonAndFlightDetailsList = doc.struct("L");
  reasonAndFlightDetailsList.add(
    doc.struct("Caption", {}, () => {
      addReasonCaption(doc, userData);
    }),
  );
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
  addFlightDetails(doc, reasonAndFlightDetailsList, userData);
  reasonSect.add(reasonAndFlightDetailsList);
  documentStruct.add(reasonSect);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);

  addDetailedReason(doc, documentStruct, userData);
};
