import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/flows/fluggastrechteFormular/context";
import { getCompensationPayment } from "~/services/airports/getCompensationPayment";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN,
} from "../../createPdfKitDocument";

export const getDefendantPartyList = (
  prozesszinsen: string,
  streitwert: string,
): Record<string, string> => {
  const interestClause =
    prozesszinsen === "yes"
      ? " nebst Zinsen in Höhe von 5 Prozentpunkten über dem jeweiligen Basiszinssatz seit Rechtshängigkeit"
      : "";

  return {
    "1. ": `Die beklagte Partei zu verurteilen, an die klagende Partei ${streitwert} €${interestClause} zu zahlen.`,
    "2. ": "Die beklagte Partei trägt die Kosten des Rechtsstreits.",
  };
};

export const STATEMENT_CLAIM_TITLE_TEXT = "Klageantrag";
export const STATEMENT_CLAIM_SUBTITLE_TEXT =
  "Die klagende Partei erhebt Antrag,";
export const STATEMENT_CLAIM_COURT_SENTENCE =
  "Sofern das Gericht das schriftliche Vorverfahren anordnet, wird für den Fall der Fristversäumnis beantragt, die beklagte Partei durch Versäumnisurteil ohne mündliche Verhandlung zu verurteilen (§ 331 ZPO).";
export const STATEMENT_CLAIM_AGREEMENT_SENTENCE =
  "Mit einer Entscheidung im schriftlichen Verfahren ohne mündliche Verhandlung (§ 128 Abs. 2 ZPO) sowie der Durchführung einer Videoverhandlung (§ 128a ZPO) bin ich einverstanden.";

export const createStatementClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const { startAirport, endAirport, prozesszinsen, versaeumnisurteil } =
    userData;
  const compensationByDistance = getCompensationPayment({
    startAirport,
    endAirport,
  });

  const defendantPartyList = getDefendantPartyList(
    prozesszinsen ?? "",
    compensationByDistance,
  );

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

  statementClaimSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(STATEMENT_CLAIM_SUBTITLE_TEXT);
    }),
  );

  const statementClaimList = doc.struct("L");

  for (const [bullet, claim] of Object.entries(defendantPartyList)) {
    statementClaimList.add(
      doc.struct("LI", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_BOLD)
          .text(bullet, PDF_MARGIN + 10, undefined, {
            continued: true,
          })
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(claim, { width: 500 });
        doc.moveDown(0.5);
      }),
    );
  }

  statementClaimSect.add(statementClaimList);

  statementClaimSect.add(
    doc.struct("P", {}, () => {
      if (versaeumnisurteil === "yes") {
        doc.text(STATEMENT_CLAIM_COURT_SENTENCE, PDF_MARGIN);
      }
      doc.text(STATEMENT_CLAIM_AGREEMENT_SENTENCE, PDF_MARGIN);
    }),
  );

  documentStruct.add(statementClaimSect);
};
