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
export const STATEMENT_NEGOTIATION_TITLE_TEXT = "Mündliche Verhandlung:";

const legacyVideoTrialAgreement = (videoverhandlung?: string): string => {
  const responses: Record<string, string> = {
    yes: "Die Teilnahme an der mündlichen Verhandlung per Video gemäß § 128a ZPO wird beantragt.",
    no: "Gegen die Durchführung einer Videoverhandlung bestehen gemäß § 253 Abs. 3 Nr. 4 ZPO Bedenken.",
    noSpecification: "",
  };
  return responses[videoverhandlung ?? ""];
};

const oralTrialAgreement = (muendlicheVerhandlung?: string): string => {
  const responses: Record<string, string> = {
    yes: "Es wird beantragt, eine mündliche Verhandlung nach §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen.",
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

const videoTrialAgreement = (
  videoverhandlung: string | undefined,
  showFGROnlineVerfahren: boolean,
): string => {
  return showFGROnlineVerfahren
    ? onlineVerfahrenVideoTrialAgreement(videoverhandlung)
    : legacyVideoTrialAgreement(videoverhandlung);
};

export const createStatementClaim = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: FluggastrechteUserData,
  showFGROnlineVerfahren: boolean,
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
    showFGROnlineVerfahren,
  );

  const negotiationTexts = showFGROnlineVerfahren
    ? [
        oralTrialAgreement(muendlicheVerhandlung),
        videoTrialAgreement(videoverhandlung, showFGROnlineVerfahren),
      ].filter((text): text is string => Boolean(text))
    : [videoTrialAgreement(videoverhandlung, showFGROnlineVerfahren)].filter(
        (text): text is string => Boolean(text),
      );

  if (versaeumnisurteil === "yes") {
    statementClaimSect.add(
      doc.struct("P", {}, () => {
        doc.text(STATEMENT_CLAIM_COURT_SENTENCE, PDF_MARGIN_HORIZONTAL);
      }),
    );
  }

  if (negotiationTexts.length > 0) {
    if (showFGROnlineVerfahren) {
      statementClaimSect.add(
        doc.struct("H3", {}, () => {
          doc
            .font(FONTS_BUNDESSANS_BOLD)
            .text(STATEMENT_NEGOTIATION_TITLE_TEXT, PDF_MARGIN_HORIZONTAL);
        }),
      );
    }

    statementClaimSect.add(
      doc.struct("P", {}, () => {
        for (const text of negotiationTexts) {
          doc.font(FONTS_BUNDESSANS_REGULAR).text(text, PDF_MARGIN_HORIZONTAL);
        }
      }),
    );
  }

  documentStruct.add(statementClaimSect);
};
