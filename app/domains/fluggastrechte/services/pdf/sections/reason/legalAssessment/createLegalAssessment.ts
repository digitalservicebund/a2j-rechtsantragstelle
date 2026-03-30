import type PDFDocument from "pdfkit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { gerichtskostenFromBetrag } from "~/domains/fluggastrechte/services/gerichtskosten";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { MARGIN_BETWEEN_SECTIONS } from "../../../configurations";
import { getFullPlaintiffName } from "../../getFullPlaintiffName";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

export const LEGAL_ASSESSMENT_TEXT = "II. Rechtliche Würdigung";
export const CLAIM_FULL_JUSTIFIED_TEXT =
  "Die Klage ist vollumfänglich begründet.";
export const DISPUTE_RESOLUTION_TITLE_TEXT =
  "Außergerichtliche Streitbeilegung:";
const DISPUTE_RESOLUTION_OCCURRED_TEXT =
  "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.";
const DISPUTE_RESOLUTION_NOT_OCCURRED_TEXT =
  "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.";
const DISPUTE_RESOLUTION_NOT_OCCURRED_WITH_ASSUMPTION_TEXT_LEGACY =
  "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.";
const DISPUTE_RESOLUTION_NOT_OCCURRED_WITH_ASSUMPTION_TEXT_ENABLED =
  "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Absatz 3 Nummer 1 ZPO nicht erreichbar ist.";
const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "Euro anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.";

type DisputeResolutionContent = {
  sectionText: string;
  showTitle: boolean;
};

const getDisputeResolutionContent = (
  { streitbeilegung, streitbeilegungGruende }: FluggastrechteUserData,
  showFGROnlineVerfahren: boolean,
): DisputeResolutionContent => {
  if (streitbeilegung === "noSpecification") {
    return { sectionText: "", showTitle: false };
  }

  if (streitbeilegung === "yes") {
    return {
      sectionText: DISPUTE_RESOLUTION_OCCURRED_TEXT,
      showTitle: showFGROnlineVerfahren,
    };
  }

  if (streitbeilegungGruende === "yes") {
    return {
      sectionText: showFGROnlineVerfahren
        ? DISPUTE_RESOLUTION_NOT_OCCURRED_WITH_ASSUMPTION_TEXT_ENABLED
        : DISPUTE_RESOLUTION_NOT_OCCURRED_WITH_ASSUMPTION_TEXT_LEGACY,
      showTitle: showFGROnlineVerfahren,
    };
  }

  return {
    sectionText: DISPUTE_RESOLUTION_NOT_OCCURRED_TEXT,
    showTitle: showFGROnlineVerfahren,
  };
};

const getTextsForHeightCalculation = (
  disputeResolutionSectionText: string,
  shouldRenderDisputeResolutionTitle: boolean,
) => {
  if (!disputeResolutionSectionText) {
    return [];
  }

  if (shouldRenderDisputeResolutionTitle) {
    return [DISPUTE_RESOLUTION_TITLE_TEXT, disputeResolutionSectionText];
  }

  return [disputeResolutionSectionText];
};

function checkAndNewPage(
  doc: typeof PDFDocument,
  additionalTextsForHeight: string[],
) {
  const legalAssessmentTextsHeight = getHeightOfString(
    [
      LEGAL_ASSESSMENT_TEXT,
      CLAIM_FULL_JUSTIFIED_TEXT,
      ...additionalTextsForHeight,
    ],
    doc,
    PDF_WIDTH_SEIZE,
  );

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: legalAssessmentTextsHeight,
  });
}

export const createLegalAssessment = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
  showFGROnlineVerfahren = false,
) => {
  const disputeResolutionContent = getDisputeResolutionContent(
    userData,
    showFGROnlineVerfahren,
  );
  const disputeResolutionSectionText = disputeResolutionContent.sectionText;
  const shouldRenderDisputeResolutionTitle =
    disputeResolutionContent.showTitle && Boolean(disputeResolutionSectionText);

  const textsForHeightCalculation = getTextsForHeightCalculation(
    disputeResolutionSectionText,
    shouldRenderDisputeResolutionTitle,
  );
  checkAndNewPage(doc, textsForHeightCalculation);

  const legalAssessmentSect = doc.struct("Sect");
  legalAssessmentSect.add(
    doc.struct("H3", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(LEGAL_ASSESSMENT_TEXT, PDF_MARGIN_HORIZONTAL);
      doc.moveDown(1);
    }),
  );

  legalAssessmentSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(CLAIM_FULL_JUSTIFIED_TEXT);

      if (shouldRenderDisputeResolutionTitle) {
        doc
          .moveDown(0.5)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(DISPUTE_RESOLUTION_TITLE_TEXT)
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(disputeResolutionSectionText);
      } else if (disputeResolutionSectionText) {
        doc.text(disputeResolutionSectionText);
      }

      doc.moveDown(4);
    }),
  );

  const compensationByDistance = getTotalCompensationClaim(userData);

  const courtCostValue = gerichtskostenFromBetrag(
    Number(compensationByDistance),
  ).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const advanceCourtText = `${ADVANCE_COURT_COSTS_FIRST_TEXT} ${courtCostValue} ${ADVANCE_COURT_COSTS_SECOND_TEXT}`;
  const advanceCourtTextHeight = doc.heightOfString(advanceCourtText, {
    width: PDF_WIDTH_SEIZE,
  });

  const plaintiffName = getFullPlaintiffName(
    userData.anrede,
    userData.title,
    userData.vorname,
    userData.nachname,
  );
  const plaintiffNameTextHeight = doc.heightOfString(plaintiffName, {
    width: PDF_WIDTH_SEIZE,
  });
  // avoid that a new page consits only of the plaintiff name
  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: advanceCourtTextHeight + plaintiffNameTextHeight,
    moveDownFactor: MARGIN_BETWEEN_SECTIONS,
    numberOfParagraphs: 2,
  });
  legalAssessmentSect.add(
    doc.struct("P", {}, () => {
      doc.text(advanceCourtText);
      doc.moveDown(1);
    }),
  );
  documentStruct.add(legalAssessmentSect);

  const plaintiffNameSect = doc.struct("Sect");

  doc.moveDown(MARGIN_BETWEEN_SECTIONS);

  plaintiffNameSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text(plaintiffName);
    }),
  );

  documentStruct.add(plaintiffNameSect);
};
