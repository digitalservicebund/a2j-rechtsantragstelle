import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

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
  statementClaimSect: PDFKit.PDFStructureElement,
) => {
  const oralNegotiationText =
    muendlicheVerhandlung === "yes"
      ? "Es wird beantragt, eine mündliche Verhandlung nach §§ 1127 Absatz 1 Satz 2 Nummer 4 ZPO anzuberaumen."
      : "";

  const defaultJudgmentText =
    versaeumnisurteil === "yes"
      ? "Sofern die gesetzlichen Voraussetzungen vorliegen, wird hiermit der Erlass eines Versäumnisurteils gem. § 331 Abs. 1 und Abs. 3 ZPO gestellt."
      : "";

  const videoNegotiationText = videoTrialAgreement(videoVerhandlung);
  const negotiationTexts = [
    oralNegotiationText,
    videoNegotiationText,
    defaultJudgmentText,
  ].filter((text): text is string => Boolean(text));

  if (negotiationTexts.length === 0) {
    return;
  }

  const totalHeightOfStrings = getHeightOfString(
    negotiationTexts,
    doc,
    PDF_WIDTH_SEIZE,
  );

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: totalHeightOfStrings,
  });

  statementClaimSect.add(
    doc.struct("P", {}, () => {
      doc.font(FONTS_BUNDESSANS_REGULAR).fontSize(10);
      for (const text of negotiationTexts) {
        doc.text(text, PDF_MARGIN_HORIZONTAL);

        const shouldAddEmptyLineBeforeDefaultJudgment =
          text === videoNegotiationText &&
          Boolean(videoNegotiationText) &&
          Boolean(defaultJudgmentText);

        if (shouldAddEmptyLineBeforeDefaultJudgment) {
          doc.moveDown(1);
        }
      }
    }),
  );
};
