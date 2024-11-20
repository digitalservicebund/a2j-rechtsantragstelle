import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
} from "~/services/pdf/createPdfKitDocument";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";
import { getStartYPosition } from "../compensationAmount/getStartYPosition";

export function addTableInfo(
  doc: PDFKit.PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  andereErsatzverbindungBeschreibung: string,
  tableEndYPosition: number,
) {
  const tableInfoHeight = doc.heightOfString(
    andereErsatzverbindungBeschreibung ?? "",
    {
      width: doc.widthOfString(andereErsatzverbindungBeschreibung ?? ""),
    },
  );

  addNewPageInCaseMissingVerticalSpace(doc, tableInfoHeight);

  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          andereErsatzverbindungBeschreibung ?? "",
          PDF_MARGIN_HORIZONTAL,
          getStartYPosition(tableEndYPosition, doc.y),
        );
    }),
  );
  documentStruct.add(reasonSect);
}
