import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { createLegalAssessment } from "./legalAssessment/createLegalAssessment";
import { MARGIN_BETWEEN_SECTIONS } from "../../configurations";
import { addCompensationAmount } from "./factsOfCases/compensationAmount/addCompensationAmount";
import { addTable } from "./factsOfCases/table/addTable";

export const REASON_TITLE_TEXT = "Begründung";

export const createReasonPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const reasonSect = doc.struct("Sect");
  const startY = doc.y;
  reasonSect.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(16)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(REASON_TITLE_TEXT, PDF_MARGIN_HORIZONTAL, startY, {
          align: "left",
        });
      doc.moveDown(MARGIN_BETWEEN_SECTIONS);
    }),
  );

  createFactsOfCases(doc, reasonSect, userData);
  documentStruct.add(reasonSect);
  const startTableY = doc.y;
  addTable(doc, documentStruct, startTableY, userData);
  addCompensationAmount(doc, documentStruct, userData);
  createLegalAssessment(doc, documentStruct, userData);
};
