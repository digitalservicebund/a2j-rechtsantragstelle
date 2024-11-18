import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularContext } from "~/domains/beratungshilfe/formular";
import type { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { pdfStyles } from "~/domains/shared/services/pdf/pdfStyles";

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
        .fontSize(pdfStyles.pageHeader.fontSize)
        .font(pdfStyles.pageHeader.font)
        .text(`${headerText} von ${userData.vorname} ${userData.nachname}`)
        .moveDown(2);
    }),
  );

  documentStruct.add(headerSect);
}
