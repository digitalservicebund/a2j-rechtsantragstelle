import type PDFDocument from "pdfkit";
import { MARGIN_RIGHT } from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const addDefendantPartyList = (
  doc: typeof PDFDocument,
  statementClaimSect: PDFKit.PDFStructureElement,
  prozesszinsen: string,
  streitwert: number,
) => {
  const interestClause =
    prozesszinsen === "yes"
      ? " nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit"
      : "";

  const defendantPartyList = {
    "1. ": `Die beklagte Partei wird verurteilt, an die klagende Partei ${streitwert} €${interestClause} zu zahlen.`,
    "2. ": "Die beklagte Partei trägt die Kosten des Rechtsstreits.",
  };

  const statementClaimList = doc.struct("L");

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
