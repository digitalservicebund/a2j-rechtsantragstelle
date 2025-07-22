import type PDFDocument from "pdfkit";
import type { FluggastrechteUserData } from "~/domains/fluggastrechte/formular/userData";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const WITNESS_EVIDENCE_TEXT =
  "Zum Beweis des unter I. dargestellten Sachverhaltes wird die klagende Partei im Prozessverlauf bei Bedarf Beweise anbieten.";
export const WITNESS_EVIDENCE_MULTIPLE_PERSONS_TEXT =
  "Zum Beweis dieses Sachverhalts wird die klagende Partei im Prozessverlauf bei Bedarf weitere Beweise anbieten.";

export const addWitnessesInfo = (
  doc: typeof PDFDocument,
  { hasZeugen, isWeiterePersonen }: FluggastrechteUserData,
) => {
  if (hasZeugen === "yes") {
    addNewPageInCaseMissingVerticalSpace(doc);
    doc.struct("P", {}, () => {
      doc.text(
        `${isWeiterePersonen === "no" ? WITNESS_EVIDENCE_TEXT : WITNESS_EVIDENCE_MULTIPLE_PERSONS_TEXT}`,
        PDF_MARGIN_HORIZONTAL,
      );
    });
  }
};
