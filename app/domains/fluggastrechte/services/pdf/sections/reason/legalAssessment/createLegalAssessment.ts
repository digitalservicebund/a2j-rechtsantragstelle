import type PDFDocument from "pdfkit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { MARGIN_BETWEEN_SECTIONS } from "../../../configurations";
import { getFullPlaintiffName } from "../../getFullPlaintiffName";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";
import { getHeightOfString } from "../getHeightOfString";

export const LEGAL_ASSESSMENT_TEXT = "II. Rechtliche Würdigung";
export const CLAIM_FULL_JUSTIFIED_TEXT =
  "Die Klage ist vollumfänglich begründet.";
const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "€ anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.";

const getAssumedSettlementSectionText = ({
  streitbeilegung,
  streitbeilegungGruende,
}: FluggastrechteUserData): string => {
  if (streitbeilegung === "noSpecification") {
    return "";
  }

  if (streitbeilegung === "yes") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.";
  }

  if (streitbeilegungGruende === "yes") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.";
  }

  return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.";
};

function checkAndNewPage(
  doc: typeof PDFDocument,
  assumedSettlementSectionText: string,
) {
  const legalAssessmentTextsHeight = getHeightOfString(
    [
      LEGAL_ASSESSMENT_TEXT,
      CLAIM_FULL_JUSTIFIED_TEXT,
      assumedSettlementSectionText,
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
) => {
  const assumedSettlementSectionText =
    getAssumedSettlementSectionText(userData);

  checkAndNewPage(doc, assumedSettlementSectionText);

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
        .text(CLAIM_FULL_JUSTIFIED_TEXT)
        .text(assumedSettlementSectionText)
        .moveDown(4);
    }),
  );

  const compensationByDistance = getTotalCompensationClaim(userData);

  const courtCostValue = gerichtskostenFromBetrag(
    Number(compensationByDistance),
  );
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
