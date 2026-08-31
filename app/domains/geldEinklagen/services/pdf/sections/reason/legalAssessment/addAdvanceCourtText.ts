import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { gerichtskostenFromBetrag } from "~/domains/shared/formular/onlineVerfahren/getCourtCost";
import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";

const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "Euro anzufordern und die Klage nach der Zahlung an die beklagte Partei zuzustellen.";

export function addAdvanceCourtText(
  doc: typeof PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  { forderungGesamtbetrag }: GeldEinklagenFormularUserData,
) {
  const gerichtskostenvorschuss = forderungGesamtbetrag
    ? gerichtskostenFromBetrag(parseCurrencyStringDE(forderungGesamtbetrag))
    : 0;
  const advanceCourtText = `${ADVANCE_COURT_COSTS_FIRST_TEXT} ${gerichtskostenvorschuss} ${ADVANCE_COURT_COSTS_SECOND_TEXT}`;

  const textHeight = getHeightOfString(advanceCourtText, doc, PDF_WIDTH_SEIZE);

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: textHeight,
  });

  legalAssessmentSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(advanceCourtText)
        .moveDown(3.5);
    }),
  );
}
