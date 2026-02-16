import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "./claimData/addDefendantPartyList";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addFreeTextApplication } from "./claimData/addFreeTextApplication";
import { addNegotiationText } from "./claimData/addNegotiationText";

const STATEMENT_CLAIM_TITLE_TEXT = "Klageantrag";

export const createStatementClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  const {
    prozesszinsen,
    anwaltskosten,
    weitereAntraege,
    videoVerhandlung,
    versaeumnisurteil,
    muendlicheVerhandlung,
  } = userData;

  const statementClaimSect = doc.struct("Sect");
  statementClaimSect.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(STATEMENT_CLAIM_TITLE_TEXT);
      doc.moveDown(1.5);
    }),
  );

  addDefendantPartyList(
    doc,
    statementClaimSect,
    prozesszinsen ?? "",
    0,
    anwaltskosten ?? "",
  );

  addFreeTextApplication(doc, weitereAntraege, statementClaimSect);

  // Add the statement claim section to the main document structure before negotiation text to break the page correctly
  documentStruct.add(statementClaimSect);

  addNegotiationText(
    doc,
    videoVerhandlung,
    versaeumnisurteil,
    muendlicheVerhandlung,
    statementClaimSect,
  );
};
