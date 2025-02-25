import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "./claimData/addDefendantPartyList";

export const STATEMENT_CLAIM_TITLE_TEXT = "Klageantrag";
export const STATEMENT_CLAIM_SUBTITLE_TEXT =
  "Es werden folgende Anträge gestellt:";
export const STATEMENT_CLAIM_COURT_SENTENCE =
  "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gem. § 331 Abs. 1 und Abs. 3 ZPO gestellt.";

const videoTrialAgreement = (videoverhandlung: string | undefined) => {
  const responses: Record<string, string> = {
    yes: "Die Teilnahme an der mündlichen Verhandlung per Video gemäß § 128a ZPO wird beantragt.",
    no: "Gegen die Durchführung einer Videoverhandlung bestehen gemäß § 253 Abs. 3 Nr. 4 ZPO Bedenken.",
    noSpecification: "",
  };
  return responses[videoverhandlung ?? ""];
};

export const createStatementClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechtContext,
) => {
  const { prozesszinsen, versaeumnisurteil, videoverhandlung } = userData;
  const compensationByDistance = getTotalCompensationClaim(userData);

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

  addDefendantPartyList(
    doc,
    statementClaimSect,
    prozesszinsen ?? "",
    compensationByDistance,
  );

  statementClaimSect.add(
    doc.struct("P", {}, () => {
      if (versaeumnisurteil === "yes") {
        doc.text(STATEMENT_CLAIM_COURT_SENTENCE, PDF_MARGIN_HORIZONTAL);
      }
      doc.text(videoTrialAgreement(videoverhandlung), PDF_MARGIN_HORIZONTAL);
    }),
  );
  documentStruct.add(statementClaimSect);
};
