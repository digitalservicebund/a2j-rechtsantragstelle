import type PDFDocument from "pdfkit";
import { FONTS_BUNDESSANS_BOLD } from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "./claimData/addDefendantPartyList";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addAdditionalApplicationsFreeText } from "./claimData/addAdditionalApplicationsFreeText";
import { addNegotiationText } from "~/domains/geldEinklagen/services/pdf/sections/firstPage/claimData/addNegotiationText";

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
    userData.forderungGesamtbetrag ?? "",
    anwaltskosten ?? "",
  );
  documentStruct.add(statementClaimSect);

  doc.addPage(); // start the free text application on a new page (2nd page)

  const additionalApplicationsSect = doc.struct("Sect");

  addAdditionalApplicationsFreeText(
    doc,
    weitereAntraege,
    additionalApplicationsSect,
  );

  addNegotiationText(
    doc,
    videoVerhandlung,
    versaeumnisurteil,
    muendlicheVerhandlung,
    additionalApplicationsSect,
  );

  documentStruct.add(additionalApplicationsSect);
};
