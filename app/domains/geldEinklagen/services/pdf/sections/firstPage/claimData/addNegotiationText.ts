import type PDFDocument from "pdfkit";
import type { GeldEinklagenFormularUserData } from "~/domains/geldEinklagen/formular/userData";
import { addNewPageInCaseMissingVerticalSpace } from "~/services/pdf/addNewPageInCaseMissingVerticalSpace";
import {
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { getHeightOfString } from "~/services/pdf/getHeightOfString";

const videoTrialAgreement = (
  videoverhandlung: GeldEinklagenFormularUserData["videoVerhandlung"],
): string => {
  const responses: Record<string, string> = {
    yes: "Die Teilnahme an der mündlichen Verhandlung per Video gemäß § 128a ZPO wird beantragt.",
    no: "Gegen die Durchführung einer Videoverhandlung bestehen gemäß § 253 Abs. 3 Nr. 4 ZPO Bedenken.",
  };
  return responses[videoverhandlung ?? ""];
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

  const totalHeightOfStrings = getHeightOfString(
    [oralNegotiationText, defaultJudgmentText, videoNegotiationText],
    doc,
    PDF_WIDTH_SEIZE,
  );

  addNewPageInCaseMissingVerticalSpace(doc, {
    extraYPosition: totalHeightOfStrings,
  });

  statementClaimSect.add(
    doc.struct("P", {}, () => {
      doc.text(oralNegotiationText, PDF_MARGIN_HORIZONTAL);
      doc.text(
        `${videoNegotiationText} ${defaultJudgmentText}`,
        PDF_MARGIN_HORIZONTAL,
      );
    }),
  );
};
