import type PDFDocument from "pdfkit";
import { type BeratungshilfeFormularUserData } from "~/domains/beratungshilfe/formular/userData";
import { type ProzesskostenhilfeFormularUserData } from "~/domains/prozesskostenhilfe/formular/userData";
import { createHeading } from "~/services/pdf/createHeading";
import { pdfStyles } from "~/services/pdf/pdfStyles";

export const createWeitereAngabenAnhang = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: ProzesskostenhilfeFormularUserData | BeratungshilfeFormularUserData,
) => {
  createHeading(doc, documentStruct, "Weitere Angaben (Freitext)", "H2");
  const originalText = userData.weitereAngaben ?? "";
  const cleanText = originalText.replace(/\r\n/g, "\n");

  documentStruct.add(
    doc.struct("P", {}, () => {
      doc.moveUp(1);
      doc
        .fontSize(pdfStyles.page.fontSize)
        .font(pdfStyles.page.font)
        .text(cleanText);
    }),
  );
};
