import type PDFDocument from "pdfkit";
import { getTotalCompensationClaim } from "~/domains/fluggastrechte/formular/services/getTotalCompensationClaim";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addDefendantPartyList } from "./claimData/addDefendantPartyList";

export const STATEMENT_CLAIM_TITLE_TEXT = "Klageantrag";
export const STATEMENT_CLAIM_COURT_SENTENCE =
  "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gem. § 331 Abs. 1 und Abs. 3 ZPO gestellt.";
export const ONLINE_STATEMENT_CLAIM_COURT_SENTENCE =
  "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gemäß § 1128 Absatz 2 in Verbindung mit § 331 Absatz 3 ZPO bzw. § 331 Absatz 1 ZPO beantragt.";
export const STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT = "Versäumnisurteil:";
export const STATEMENT_NEGOTIATION_TITLE_TEXT = "Mündliche Verhandlung:";

const oralTrialAgreement = (muendlicheVerhandlung?: string): string => {
  const responses: Record<string, string> = {
    yes: "Es wird beantragt, eine mündliche Verhandlung gemäß §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen.",
  };
  return responses[muendlicheVerhandlung ?? ""] ?? "";
};

const onlineVerfahrenVideoTrialAgreement = (
  videoverhandlung: string | undefined,
): string => {
  const responses: Record<string, string> = {
    yes: "Die Teilnahme an einer mündlichen Verhandlung per Video gemäß §§ 1127 Absatz 3, 128a ZPO wird beantragt.",
    no: "Gegen die Durchführung einer Verhandlung per Video bestehen gemäß § 253 Absatz 3 Nr. 4 ZPO Bedenken.",
    noSpecification: "",
  };
  return responses[videoverhandlung ?? ""] ?? "";
};

export const createStatementClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
) => {
  const {
    prozesszinsen,
    versaeumnisurteil,
    videoverhandlung,
    muendlicheVerhandlung,
  } = userData;
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

  addDefendantPartyList(
    doc,
    statementClaimSect,
    prozesszinsen ?? "",
    compensationByDistance,
  );

  const negotiationTexts = [
    oralTrialAgreement(muendlicheVerhandlung),
    onlineVerfahrenVideoTrialAgreement(videoverhandlung),
  ].filter((text): text is string => Boolean(text));

  if (negotiationTexts.length > 0) {
    statementClaimSect.add(
      doc.struct("H3", {}, () => {
        doc
          .moveDown(1)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(STATEMENT_NEGOTIATION_TITLE_TEXT, PDF_MARGIN_HORIZONTAL);
      }),
    );

    statementClaimSect.add(
      doc.struct("P", {}, () => {
        for (const text of negotiationTexts) {
          doc.font(FONTS_BUNDESSANS_REGULAR).text(text, PDF_MARGIN_HORIZONTAL);
        }
      }),
    );
  }

  if (versaeumnisurteil === "yes") {
    statementClaimSect.add(
      doc.struct("H3", {}, () => {
        doc
          .moveDown(1)
          .font(FONTS_BUNDESSANS_BOLD)
          .text(STATEMENT_DEFAULT_JUDGMENT_TITLE_TEXT, PDF_MARGIN_HORIZONTAL);
      }),
    );

    statementClaimSect.add(
      doc.struct("P", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .text(ONLINE_STATEMENT_CLAIM_COURT_SENTENCE, PDF_MARGIN_HORIZONTAL);
      }),
    );
  }

  documentStruct.add(statementClaimSect);
};
