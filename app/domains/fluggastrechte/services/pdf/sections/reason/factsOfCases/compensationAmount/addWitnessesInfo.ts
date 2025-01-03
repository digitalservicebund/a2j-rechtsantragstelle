import type PDFDocument from "pdfkit";
import type { FluggastrechtContext } from "~/domains/fluggastrechte/formular/context";
import { PDF_MARGIN_HORIZONTAL } from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export const PLAINTIFF_WITNESSES_TEXT =
  "Zum Beweis dieses Sachverhalts wird die klagende Partei im Prozessverlauf bei Bedarf Zeugen benennen.";
export const PLAINTIFF_WITNESSES_MULTIPLE_PERSONS_TEXT =
  "Zum Beweis dieses Sachverhalts wird die klagende Partei im Prozessverlauf bei Bedarf weitere Zeugen benennen.";

export const addWitnessesInfo = (
  doc: typeof PDFDocument,
  { hasZeugen, isWeiterePersonen }: FluggastrechtContext,
) => {
  if (hasZeugen === "yes") {
    addNewPageInCaseMissingVerticalSpace(doc);
    doc.text(
      `${isWeiterePersonen === "no" ? PLAINTIFF_WITNESSES_TEXT : PLAINTIFF_WITNESSES_MULTIPLE_PERSONS_TEXT}`,
      PDF_MARGIN_HORIZONTAL,
    );
  }
};
