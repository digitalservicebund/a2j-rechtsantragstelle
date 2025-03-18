import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const WITNESS_EVIDENCE_TEXT =
  "Zum Beweis des unter I. dargestellten Sachverhaltes wird die klagende Partei im Prozessverlauf bei Bedarf Beweise anbieten.";
export const WITNESS_EVIDENCE_MULTIPLE_PERSONS_TEXT =
  "Zum Beweis dieses Sachverhalts wird die klagende Partei im Prozessverlauf bei Bedarf weitere Beweise anbieten.";

export const addWitnessesInfo = (
  doc: typeof PDFDocument,
  { hasZeugen, isWeiterePersonen }: FluggastrechtContext,
) => {
  if (hasZeugen === "yes") {
    addNewPageInCaseMissingVerticalSpace(doc);
    doc.text(
      `${isWeiterePersonen === "no" ? WITNESS_EVIDENCE_TEXT : WITNESS_EVIDENCE_MULTIPLE_PERSONS_TEXT}`,
      PDF_MARGIN_HORIZONTAL,
    );
  }
};
