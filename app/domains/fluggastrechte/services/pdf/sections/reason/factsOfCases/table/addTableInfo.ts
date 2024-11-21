import {
  FONTS_BUNDESSANS_REGULAR,
  PDF_MARGIN_HORIZONTAL,
  PDF_MARGIN_VERTICAL,
} from "~/services/pdf/createPdfKitDocument";
import { COLUMN_HEIGHT } from "./tableConfigurations";
import { addNewPageInCaseMissingVerticalSpace } from "../../addNewPageInCaseMissingVerticalSpace";

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

  addNewPageInCaseMissingVerticalSpace(doc, tableInfoHeight + COLUMN_HEIGHT);

  const reasonSect = doc.struct("Sect");
  reasonSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(10)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(
          andereErsatzverbindungBeschreibung ?? "",
          PDF_MARGIN_HORIZONTAL,
          // in case the current doc.y position is same the vertical margin, the document jump to a new page, so it should start the current doc.y position
          doc.y === PDF_MARGIN_VERTICAL ? doc.y : tableEndYPosition,
        );
    }),
  );
  documentStruct.add(reasonSect);
}
