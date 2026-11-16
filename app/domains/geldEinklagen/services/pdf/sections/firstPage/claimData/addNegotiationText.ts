import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import {
  muendlicheVerhandlungText,
  videoVerhandlungText,
} from "~/domains/geldEinklagen/services/antragTexts";
import {
  FONTS_BUNDESSANS_BOLD,
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";

export const addNegotiationText = (
  doc: typeof PDFDocument,
  videoVerhandlung: GeldEinklagenFormularUserData["videoVerhandlung"],
  versaeumnisurteil: GeldEinklagenFormularUserData["versaeumnisurteil"],
  muendlicheVerhandlung: GeldEinklagenFormularUserData["muendlicheVerhandlung"],
  additionalApplicationsSect: PDFKit.PDFStructureElement,
) => {
  const negotiationTitle = "Mündliche Verhandlung:";
  const defaultJudgmentTitle = "Versäumnisurteil:";

  const oralNegotiationText = muendlicheVerhandlungText(muendlicheVerhandlung);

  const defaultJudgmentText =
    versaeumnisurteil === "yes"
      ? "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gemäß § 1128 Absatz 2 in Verbindung mit § 331 Absatz 3 ZPO bzw. § 331 Absatz 1 ZPO beantragt."
      : "";

  const videoNegotiationText = videoVerhandlungText(videoVerhandlung);
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
