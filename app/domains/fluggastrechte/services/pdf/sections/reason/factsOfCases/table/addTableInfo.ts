import { MARGIN_BETWEEN_SECTIONS } from "~/domains/fluggastrechte/services/pdf/configurations";
import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_WIDTH_SEIZE,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

export function addTableInfo(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  andereErsatzverbindungBeschreibung: string,
) {
  if (andereErsatzverbindungBeschreibung.length === 0) {
    return;
  }

  const tableInfoHeight = doc.heightOfString(
    andereErsatzverbindungBeschreibung,
    {
      width: PDF_WIDTH_SEIZE,
    },
  );

  addNewPageInCaseMissingVerticalSpace(doc, tableInfoHeight);

  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(andereErsatzverbindungBeschreibung, PDF_MARGIN_HORIZONTAL)
        .moveDown(MARGIN_BETWEEN_SECTIONS);
    }),
  );

  documentStruct.add(reasonSect);
}
