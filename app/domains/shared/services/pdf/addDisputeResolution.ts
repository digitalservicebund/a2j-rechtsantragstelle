import type PDFDocument from "pdfkit";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

const CLAIM_FULL_JUSTIFIED_TEXT = "Die Klage ist vollumfänglich begründet.";
const DISPUTE_RESOLUTION_TITLE = "Außergerichtliche Streitbeilegung:";

const DISPUTE_RESOLUTION_OCCURRED_TEXT =
  "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.";
const DISPUTE_RESOLUTION_NOT_OCCURRED_TEXT =
  "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.";
const DISPUTE_RESOLUTION_NOT_OCCURRED_WITH_ASSUMPTION_TEXT_ENABLED =
  "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung gemäß § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist.";

type DisputeResolution = {
  streitbeilegung?: "yes" | "no" | "noSpecification";
  streitbeilegungGruende?: "yes" | "no" | "noSpecification";
};

const getDisputeResolutionText = ({
  streitbeilegung,
  streitbeilegungGruende,
}: DisputeResolution): string => {
  if (streitbeilegung === "noSpecification") {
    return "";
  }

  if (streitbeilegung === "yes") {
    return DISPUTE_RESOLUTION_OCCURRED_TEXT;
  }

  if (streitbeilegungGruende === "yes") {
    return DISPUTE_RESOLUTION_NOT_OCCURRED_WITH_ASSUMPTION_TEXT_ENABLED;
  }

  return DISPUTE_RESOLUTION_NOT_OCCURRED_TEXT;
};

export function addDisputeResolution(
  doc: typeof PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  { streitbeilegung, streitbeilegungGruende }: DisputeResolution,
) {
  const disputeResolutionText = getDisputeResolutionText({
    streitbeilegung,
    streitbeilegungGruende,
  });

  legalAssessmentSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(CLAIM_FULL_JUSTIFIED_TEXT)
        .moveDown(1);

      if (!disputeResolutionText) {
        doc.moveDown(4);
      }
    }),
  );

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
          .text(disputeResolutionText)
          .moveDown(4);
      }),
    );
  }
}
