import type PDFDocument from "pdfkit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { gerichtskostenFromBetrag } from "~/domains/shared/formular/onlineVerfahren/getCourtCost";
import {
  FONTS_BUNDESSANS_BOLD,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { MARGIN_BETWEEN_SECTIONS } from "../../../configurations";
import { getFullPlaintiffName } from "../../getFullPlaintiffName";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import { addDisputeResolution } from "~/domains/shared/services/pdf/addDisputeResolution";

export const LEGAL_ASSESSMENT_TEXT = "II. Rechtliche Würdigung";
const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "Euro anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.";

export const createLegalAssessment = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
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

  addDisputeResolution(doc, legalAssessmentSect, {
    streitbeilegung: userData.streitbeilegung,
    streitbeilegungGruende: userData.streitbeilegungGruende,
  });

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
