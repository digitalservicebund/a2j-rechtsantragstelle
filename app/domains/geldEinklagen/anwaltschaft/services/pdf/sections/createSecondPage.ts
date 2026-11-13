import type PDFDocument from "pdfkit";
import type { GeldEinklagenAnwaltschaftUserData } from "~/domains/geldEinklagen/anwaltschaft/userData";
import { addBeklagende } from "./addBeklagende";
import { addBeklagendeProzessbevollmaechtigte } from "./addBeklagendeProzessbevollmaechtigte";
import { addHauptantraege } from "./addHauptantraege";
import { addInhalteDerKlage } from "./addInhalteDerKlage";
import { PDF_SIZE_FORMAT } from "~/services/pdf/createPdfKitDocument";

export const createSecondPage = (
  doc: typeof PDFDocument,
  documentStruct: PDFKit.PDFStructureElement,
  userData: GeldEinklagenAnwaltschaftUserData,
) => {
  doc.addPage({
    size: PDF_SIZE_FORMAT,
    margins: { ...doc.page.margins, bottom: 70 },
  });
  const section = doc.struct("Sect");
  documentStruct.add(section);
  addBeklagende(doc, section, userData);
  doc.moveDown();
  addBeklagendeProzessbevollmaechtigte(doc, section, userData);
  doc.moveDown(2);
  addInhalteDerKlage(doc, section, userData);
  doc.moveDown(2);
  addHauptantraege(doc, section, userData);
};
