import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { createFactsOfCases } from "./factsOfCases/createFactsOfCases";
import { createLegalAssessment } from "./legalAssessment/createLegalAssessment";

export const REASON_TITLE_TEXT = "Begründung";

export const createReasonPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(16)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(REASON_TITLE_TEXT, { align: "left" });
    }),
  );

  documentStruct.add(reasonSect);

  doc.moveDown(1);
  createFactsOfCases(doc, documentStruct, userData);
  createLegalAssessment(doc, documentStruct, userData);
};
