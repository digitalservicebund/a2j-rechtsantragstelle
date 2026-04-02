import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { gerichtskostenFromBetrag } from "~/domains/shared/formular/onlineVerfahren/getCourtCost";
import { parseCurrencyStringDE } from "~/services/validation/money/formatCents";
import { FONTS_BUNDESSANS_REGULAR } from "~/services/pdf/createPdfKitDocument";

const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "Euro anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.";

export function addAdvanceCourtText(
  doc: typeof PDFDocument,
  legalAssessmentSect: PDFKit.PDFStructureElement,
  { forderungGesamtbetrag }: GeldEinklagenFormularUserData,
) {
  const gerichtskostenvorschuss = forderungGesamtbetrag
    ? gerichtskostenFromBetrag(parseCurrencyStringDE(forderungGesamtbetrag))
    : 0;
  const advanceCourtText = `${ADVANCE_COURT_COSTS_FIRST_TEXT} ${gerichtskostenvorschuss} ${ADVANCE_COURT_COSTS_SECOND_TEXT}`;

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
