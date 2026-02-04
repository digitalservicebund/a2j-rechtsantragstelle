import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "./claimData/addDefendantPartyList";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";

const STATEMENT_CLAIM_TITLE_TEXT = "Klageantrag";

export const createStatementClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenFormularUserData,
) => {
  const { prozesszinsen, anwaltskosten } = userData;

  const statementClaimSect = doc.struct("Sect");
  statementClaimSect.add(
    doc.struct("H2", {}, () => {
      doc
        .fontSize(14)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(STATEMENT_CLAIM_TITLE_TEXT);
      doc.moveDown(1);
    }),
  );

  addDefendantPartyList(
    doc,
    statementClaimSect,
    prozesszinsen ?? "",
    0,
    anwaltskosten ?? "",
  );

  documentStruct.add(statementClaimSect);
};
