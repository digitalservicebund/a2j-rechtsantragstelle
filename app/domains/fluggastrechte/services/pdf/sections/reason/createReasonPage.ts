import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "./addNewPageInCaseMissingVerticalSpace";
import { addCompensationAmount } from "./factsOfCases/compensationAmount/addCompensationAmount";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { addTable } from "./factsOfCases/table/addTable";
import { createLegalAssessment } from "./legalAssessment/createLegalAssessment";
import { MARGIN_BETWEEN_SECTIONS } from "../../configurations";
import {
  COLUMN_HEIGHT,
  MARGIN_BOTTOM,
} from "./factsOfCases/table/tableConfigurations";

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
      doc.moveDown(1);
    }),
  );

  createFactsOfCases(doc, reasonSect, documentStruct, userData);

  addNewPageInCaseMissingVerticalSpace(doc, COLUMN_HEIGHT * 4 + MARGIN_BOTTOM);
  const startTableY = doc.y;
  addTable(doc, documentStruct, startTableY, userData);
  addCompensationAmount(doc, documentStruct, userData);
  doc.moveDown(MARGIN_BETWEEN_SECTIONS);
  createLegalAssessment(doc, documentStruct, userData);
};
