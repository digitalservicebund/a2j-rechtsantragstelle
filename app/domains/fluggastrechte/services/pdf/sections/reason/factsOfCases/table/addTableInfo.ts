import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "../../../../createPdfKitDocument";

export function addTableInfo(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  andereErsatzverbindungBeschreibung: string,
  tableEndYPosition: number,
) {
  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          andereErsatzverbindungBeschreibung ?? "",
          PDF_MARGIN_HORIZONTAL,
          tableEndYPosition,
        );
    }),
  );
  documentStruct.add(reasonSect);
}
