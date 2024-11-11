import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { gerichtskostenFromBetrag } from "~/domains/geldEinklagen/shared/gerichtskosten";
import { getCompensationPayment } from "~/services/airports/getCompensationPayment";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
} from "../../../createPdfKitDocument";
import { getFullPlaintiffName } from "../../getFullPlaintiffName";

export const LEGAL_ASSESSMENT_TEXT = "II. Rechtliche Würdigung";
export const CLAIM_FULL_JUSTIFIED_TEXT =
  "Die Klage ist vollumfänglich begründet.";
export const ASSUMED_SETTLEMENT_SECTION_TEXT =
  "Es wird davon ausgegangen, dass eine gütliche Einigung nach §253 Abs. 3 Nr. 1 ZPO nicht erreichbar ist.";
export const ADVANCE_COURT_COSTS_FIRST_TEXT =
  "Das Gericht wird gebeten, der klagenden Partei das Aktenzeichnen des Gerichts mitzuteilen, den Gerichtskostenvorschuss in Höhe von";
export const ADVANCE_COURT_COSTS_SECOND_TEXT =
  "€ anzufordern und die Klage nach der Zahlung schnellstmöglich an die beklagte Partei zuzustellen.";

export const createLegalAssessment = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const legalAssessmentSect = doc.struct("Sect");
  legalAssessmentSect.add(
    doc.struct("H2", {}, () => {
      doc.fontSize(14).font(FONTS_BUNDESSANS_BOLD).text(LEGAL_ASSESSMENT_TEXT);
      doc.moveDown(1);
    }),
  );

  documentStruct.add(legalAssessmentSect);

  const compensationByDistance = getCompensationPayment({
    startAirport: userData.startAirport,
    endAirport: userData.endAirport,
  });

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
        .text(ASSUMED_SETTLEMENT_SECTION_TEXT)
        .moveDown(4)
        .text(
          `${ADVANCE_COURT_COSTS_FIRST_TEXT} ${courtCostValue} ${ADVANCE_COURT_COSTS_SECOND_TEXT}`,
        )
        .moveDown(2)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(getFullPlaintiffName(userData));
    }),
  );
  documentStruct.add(reasonSect);
};
