import type PDFDocument from "pdfkit";
import { ProzesskostenhilfeFormularContext } from "~/domains/prozesskostenhilfe/formular";
import { createHeading } from "~/services/pdf/createHeading";
import { pdfStyles } from "~/services/pdf/pdfStyles";

export const createWeitereAngaben = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: ProzesskostenhilfeFormularContext,
) => {
  createHeading(doc, documentStruct, "Weitere Angaben (Freitext)", "H2");
  documentStruct.add(
    doc.struct("P", {}, () => {
      doc
        .fontSize(pdfStyles.page.fontSize)
        .font(pdfStyles.page.font)
        .text(userData.weitereAngaben ?? "");
    }),
  );
};
