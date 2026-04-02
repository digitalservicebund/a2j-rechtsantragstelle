import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

const videoTrialAgreement = (
  videoverhandlung: GeldEinklagenFormularUserData["videoVerhandlung"],
): string => {
  const responses: Record<string, string> = {
    yes: "Die Teilnahme an einer mündlichen Verhandlung per Video gemäß §§ 1127 Absatz 3, 128a ZPO wird beantragt.",
    no: "Gegen die Durchführung einer Verhandlung per Video bestehen gemäß § 253 Absatz 3 Nr. 4 ZPO Bedenken.",
  };
  return responses[videoverhandlung ?? ""] ?? "";
};

export const addNegotiationText = (
  doc: typeof PDFDocument,
  videoVerhandlung: GeldEinklagenFormularUserData["videoVerhandlung"],
  versaeumnisurteil: GeldEinklagenFormularUserData["versaeumnisurteil"],
  muendlicheVerhandlung: GeldEinklagenFormularUserData["muendlicheVerhandlung"],
  additionalApplicationsSect: PDFKit.PDFStructureElement,
) => {
  const negotiationTitle = "Mündliche Verhandlung:";
  const defaultJudgmentTitle = "Versäumnisurteil:";

  const oralNegotiationText =
    muendlicheVerhandlung === "yes"
      ? "Es wird beantragt, eine mündliche Verhandlung gemäß §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen."
      : "";

  const defaultJudgmentText =
    versaeumnisurteil === "yes"
      ? "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gemäß § 1128 Absatz 2 in Verbindung mit § 331 Absatz 3 ZPO bzw. § 331 Absatz 1 ZPO beantragt."
      : "";

  const videoNegotiationText = videoTrialAgreement(videoVerhandlung);
  const negotiationTexts = [oralNegotiationText, videoNegotiationText].filter(
    (text): text is string => Boolean(text),
  );

  const shouldShowNegotiationTitle = negotiationTexts.length > 0;
  const shouldShowDefaultJudgmentTitle = Boolean(defaultJudgmentText);

  if (!shouldShowNegotiationTitle && !shouldShowDefaultJudgmentTitle) {
    return;
  }

  if (shouldShowNegotiationTitle) {
    additionalApplicationsSect.add(
      doc.struct("H3", {}, () => {
        doc.font(FONTS_BUNDESSANS_BOLD).fontSize(10).text(negotiationTitle);
      }),
    );

    additionalApplicationsSect.add(
      doc.struct("P", {}, () => {
        doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);
        for (const text of negotiationTexts) {
          doc.text(text, PDF_MARGIN_HORIZONTAL);
        }

        if (shouldShowDefaultJudgmentTitle) {
          doc.moveDown(1);
        }
      }),
    );
  }

  if (shouldShowDefaultJudgmentTitle) {
    additionalApplicationsSect.add(
      doc.struct("H3", {}, () => {
        doc.font(FONTS_BUNDESSANS_BOLD).fontSize(10).text(defaultJudgmentTitle);
      }),
    );

    additionalApplicationsSect.add(
      doc.struct("P", {}, () => {
        doc
          .font(FONTS_BUNDESSANS_REGULAR)
          .fontSize(10)
          .text(defaultJudgmentText, PDF_MARGIN_HORIZONTAL);
      }),
    );
  }
};
