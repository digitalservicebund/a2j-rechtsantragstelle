import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

export const CLAIM_FULL_JUSTIFIED_TEXT =
  "Die Klage ist vollumfänglich begründet.";

export const DISPUTE_RESOLUTION_TITLE = "Außergerichtliche Streitbeilegung:";

const getDisputeResolutionText = ({
  streitbeilegung,
  streitbeilegungGruende,
}: GeldEinklagenFormularUserData): string => {
  if (streitbeilegung === "yes") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.";
  }

  if (streitbeilegung === "no") {
    if (streitbeilegungGruende === "yes") {
      return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist.";
    }

    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.";
  }

  if (
    streitbeilegung === "noSpecification" &&
    streitbeilegungGruende === "yes"
  ) {
    return "Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist.";
  }

  return "";
};

export function addDisputeResolution(
  doc: typeof PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) {
  const disputeResolutionText = getDisputeResolutionText(userData);

  const legalAssessmentTextsHeight = getHeightOfString(
    [
      CLAIM_FULL_JUSTIFIED_TEXT,
      DISPUTE_RESOLUTION_TITLE,
      disputeResolutionText,
    ],
    doc,
    PDF_WIDTH_SEIZE,
  );

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: legalAssessmentTextsHeight,
  });

  legalAssessmentSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(CLAIM_FULL_JUSTIFIED_TEXT)
        .moveDown(1);
    }),
  );

  if (disputeResolutionText) {
    legalAssessmentSect.add(
      doc.struct("P", {}, () => {
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
          .text(disputeResolutionText)
          .moveDown(4);
      }),
    );
  }
}
