import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { styles } from "~/services/pdf/attachment/styles";
import { FONTS_BUNDESSANS_REGULAR } from "~/services/pdf/createPdfKitDocument";

export function createHeader<
  TContext extends
    | BeratungshilfeFormularContext
    | ProzesskostenhilfeFormularContext,
>(
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: TContext,
  headerText: string,
) {
  const headerSect = doc.struct("Sect");

  headerSect.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(styles.pageHeader.fontSize)
        .font(FONTS_BUNDESSANS_REGULAR)
        .text(`${headerText} von ${userData.vorname} ${userData.nachname}`)
        .moveDown(2);
    }),
  );

  documentStruct.add(headerSect);
}
