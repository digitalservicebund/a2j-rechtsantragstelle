import type { PDFDocument } from "pdf-lib";
import type { ProzesskostenhilfeFormularContext } from "../../formular";

export function printNameInSignatureFormField(
  pdfDoc: PDFDocument,
  userData: ProzesskostenhilfeFormularContext,
) {
  if (userData.versandArt === "digital") {
    pdfDoc.getPage(3).drawText(`${userData.vorname} ${userData.nachname}`, {
      x: 200,
      y: 75,
      size: 10,
    });
  }
}
