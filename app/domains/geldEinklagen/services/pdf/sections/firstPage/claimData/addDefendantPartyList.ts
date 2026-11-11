import type PDFDocument from "pdfkit";
import {
  anwaltskostenAntragText,
  hauptforderungAntragText,
} from "~/domains/geldEinklagen/services/antragTexts";
import { MARGIN_RIGHT } from "~/domains/geldEinklagen/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

const STATEMENT_CLAIM_SUBTITLE_TEXT = "Es werden folgende Anträge gestellt:";

export const addDefendantPartyList = (
  doc: typeof PDFDocument,
  statementClaimSect: PDFKit.PDFStructureElement,
  prozesszinsen: string,
  streitwert: string,
  anwaltskosten: string,
) => {
  const defendantPartyList = {
    "1. ": hauptforderungAntragText(streitwert, prozesszinsen),
    ...(anwaltskosten && {
      "2. ": anwaltskostenAntragText(anwaltskosten, prozesszinsen),
    }),
  };

  const statementClaimList = doc.struct("L");

  statementClaimList.add(
    doc.struct("Caption", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_BOLD)
        .text(STATEMENT_CLAIM_SUBTITLE_TEXT);
    }),
  );

  for (const [bullet, claim] of Object.entries(defendantPartyList)) {
    const statementClaimListItem = doc.struct("LI");
    statementClaimListItem.add(
      doc.struct("LBody", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_BOLD)
          .text(bullet, PDF_MARGIN_HORIZONTAL + MARGIN_RIGHT, undefined, {
            continued: true,
          })
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(claim);
        doc.moveDown(0.5);
      }),
    );
    statementClaimList.add(statementClaimListItem);
  }
  statementClaimSect.add(statementClaimList);
};
