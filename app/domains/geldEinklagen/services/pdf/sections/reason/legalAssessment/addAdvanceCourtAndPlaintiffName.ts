import type PDFDocument from "pdfkit";
import { getFullPlaintiffName } from "~/domains/fluggastrechte/services/pdf/sections/getFullPlaintiffName";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";

const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "Euro anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.";

export function addAdvanceCourtAndPlaintiffName(
  doc: typeof PDFDocument,
  reasonSect: PDFKit.PDFStructureElement,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  {
    klagendePersonAnrede,
    klagendePersonTitle,
    klagendePersonVorname,
    klagendePersonNachname,
  }: GeldEinklagenFormularUserData,
) {
  const advanceCourtText = `${ADVANCE_COURT_COSTS_FIRST_TEXT} 0 ${ADVANCE_COURT_COSTS_SECOND_TEXT}`;
  const advanceCourtTextHeight = doc.heightOfString(advanceCourtText, {
    width: PDF_WIDTH_SEIZE,
  });

  const plaintiffName = getFullPlaintiffName(
    klagendePersonAnrede,
    klagendePersonTitle === "none" ? "" : klagendePersonTitle,
    klagendePersonVorname,
    klagendePersonNachname,
  );

  const plaintiffNameTextHeight = doc.heightOfString(plaintiffName, {
    width: PDF_WIDTH_SEIZE,
  });

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: advanceCourtTextHeight + plaintiffNameTextHeight,
    moveDownFactor: 1.5,
    numberOfParagraphs: 2,
  });

  legalAssessmentSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(advanceCourtText)
        .moveDown(2);
    }),
  );

  const plaintiffNameSect = doc.struct("Sect");

  doc.moveDown(1.5);

  plaintiffNameSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_BOLD).text(plaintiffName);
    }),
  );

  reasonSect.add(plaintiffNameSect);
}
