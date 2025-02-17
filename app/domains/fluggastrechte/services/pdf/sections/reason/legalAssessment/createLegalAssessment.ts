import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getFullPlaintiffName } from "../../getFullPlaintiffName";
import { addNewPageInCaseMissingVerticalSpace } from "../addNewPageInCaseMissingVerticalSpace";

export const LEGAL_ASSESSMENT_TEXT = "II. Rechtliche Würdigung";
export const CLAIM_FULL_JUSTIFIED_TEXT =
  "Die Klage ist vollumfänglich begründet.";
export const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
export const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "€ anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.";

const getAssumedSettlementSectionText = ({
  streitbeilegung,
  streitbeilegungGruende,
}: FluggastrechtContext): string => {
  if (streitbeilegung === "noSpecification") {
    return "";
  }

  if (streitbeilegung === "yes") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat stattgefunden.";
  }

  if (streitbeilegungGruende === "yesAirlineAgainst") {
    return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden. Es wird davon ausgegangen, dass eine gütliche Einigung nach § 253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.";
  }

  return "Der Versuch einer außergerichtlichen Streitbeilegung hat nicht stattgefunden.";
};

function checkAndNewPage(
  doc: typeof PDFDocument,
  assumedSettlementSectionText: string,
) {
  const legalAssessmentHeight = doc.heightOfString(LEGAL_ASSESSMENT_TEXT, {
    width: PDF_WIDTH_SEIZE,
  });

  const claimFullJustifiedTextHeight = doc.heightOfString(
    CLAIM_FULL_JUSTIFIED_TEXT,
    {
      width: PDF_WIDTH_SEIZE,
    },
  );

  const assumedSettlementSectionTextHeight = doc.heightOfString(
    assumedSettlementSectionText,
    {
      width: PDF_WIDTH_SEIZE,
    },
  );

  addNewPageInCaseMissingVerticalSpace(
    doc,
    legalAssessmentHeight +
      claimFullJustifiedTextHeight +
      assumedSettlementSectionTextHeight,
  );
}

export const createLegalAssessment = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const assumedSettlementSectionText =
    getAssumedSettlementSectionText(userData);

  checkAndNewPage(doc, assumedSettlementSectionText);

  const legalAssessmentSect = doc.struct("Sect");
  legalAssessmentSect.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(LEGAL_ASSESSMENT_TEXT, PDF_MARGIN_HORIZONTAL);
      doc.moveDown(1);
    }),
  );

  documentStruct.add(legalAssessmentSect);

  const compensationByDistance = getTotalCompensationClaim(userData);

  const courtCostValue = gerichtskostenFromBetrag(
    Number(compensationByDistance),
  );

  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(CLAIM_FULL_JUSTIFIED_TEXT)
        .text(assumedSettlementSectionText)
        .moveDown(4);

      const advanceCourtText = `${ADVANCE_COURT_COSTS_FIRST_TEXT} ${courtCostValue} ${ADVANCE_COURT_COSTS_SECOND_TEXT}`;
      const advanceCourtTextHeight = doc.heightOfString(advanceCourtText, {
        width: PDF_WIDTH_SEIZE,
      });
      addNewPageInCaseMissingVerticalSpace(doc, advanceCourtTextHeight);

      doc
        .text(advanceCourtText)
        .moveDown(2)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(
          getFullPlaintiffName(
            userData.anrede,
            userData.title,
            userData.vorname,
            userData.nachname,
          ),
        );
    }),
  );
  documentStruct.add(reasonSect);
};
