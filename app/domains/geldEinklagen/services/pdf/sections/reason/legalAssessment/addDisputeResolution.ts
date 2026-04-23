import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

const CLAIM_FULL_JUSTIFIED_TEXT = "Die Klage ist vollumfänglich begründet.";
export const DISPUTE_RESOLUTION_TITLE = "Außergerichtliche Streitbeilegung:";

const getDisputeResolutionText = ({
  streitbeilegung,
  streitbeilegungGruende,
}: GeldEinklagenFormularUserData): string => {
  if (streitbeilegung === "yes") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.";
  }

  if (streitbeilegung === "no") {
    const streitbeilegungGruendeText =
      streitbeilegungGruende === "yes"
        ? " Es wird davon ausgegangen, dass eine gütliche Einigung gemäß § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist."
        : "";

    return `Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.${streitbeilegungGruendeText}`;
  }

  return "";
};

export function addDisputeResolution(
  doc: typeof PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) {
  legalAssessmentSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(CLAIM_FULL_JUSTIFIED_TEXT)
        .moveDown(1);
    }),
  );

  const disputeResolutionText = getDisputeResolutionText(userData);

  if (disputeResolutionText) {
    const legalAssessmentTextsHeight = getHeightOfString(
      [DISPUTE_RESOLUTION_TITLE, disputeResolutionText],
      doc,
      PDF_WIDTH_SEIZE,
    );

    addNewPageInCaseMissingVerticalSpace(doc, {
      extraYPosition: legalAssessmentTextsHeight,
    });

    legalAssessmentSect.add(
      doc.struct("H4", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(DISPUTE_RESOLUTION_TITLE);
      }),
    );

    legalAssessmentSect.add(
      doc.struct("P", {}, () => {
        doc
          .fontSize(10)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(disputeResolutionText);
      }),
    );
  }

  doc.moveDown(4);
}
