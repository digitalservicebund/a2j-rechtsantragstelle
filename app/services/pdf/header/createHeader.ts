import type PDFDocument from "pdfkit";
import type { BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular";
import type { ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { pdfStyles } from "~/services/pdf/pdfStyles";

export function createHeader<
  TContext extends
    | BeratungshilfeFormularUserData
    | ProzesskostenhilfeFormularUserData,
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
