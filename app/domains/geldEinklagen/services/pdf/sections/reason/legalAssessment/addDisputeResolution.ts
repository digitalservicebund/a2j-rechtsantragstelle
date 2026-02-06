import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

export const CLAIM_FULL_JUSTIFIED_TEXT =
  "Die Klage ist vollumfänglich begründet.";

const getAssumedSettlementSectionText = ({
  streitbeilegung,
  streitbeilegungGruende,
}: GeldEinklagenFormularUserData): string => {
  if (streitbeilegung === "yes") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.";
  }

  if (
    streitbeilegung === "noSpecification" &&
    streitbeilegungGruende === "yes"
  ) {
    return "Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.";
  }

  if (streitbeilegungGruende === "yes") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.";
  }

  return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.";
};

export function addDisputeResolution(
  doc: typeof PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) {
  const disputeResolutionText = getAssumedSettlementSectionText(userData);

  const legalAssessmentTextsHeight = getHeightOfString(
    [CLAIM_FULL_JUSTIFIED_TEXT, disputeResolutionText],
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
        .text(disputeResolutionText)
        .moveDown(4);
    }),
  );
}
